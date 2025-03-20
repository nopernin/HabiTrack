
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  UserCredential,
  updateProfile 
} from 'firebase/auth';
import { auth, db } from '../firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';

export type UserRole = 'proprietaire' | 'locataire';

export interface UserData {
  uid: string;
  email: string;
  role: UserRole;
  nom?: string;
  prenom?: string;
  telephone?: string;
  proprietaireId?: string;
  bienId?: string;
}

export const registerUser = async (
  email: string, 
  password: string, 
  role: UserRole, 
  userData: {
    nom: string;
    prenom: string;
    telephone: string;
    proprietaireId?: string;
    bienId?: string;
  }
): Promise<UserCredential> => {
  try {
    // Create user with email and password
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Set the display name as nom + prenom
    await updateProfile(user, {
      displayName: `${userData.prenom} ${userData.nom}`
    });
    
    // Create user document in Firestore
    const userDocRef = doc(db, role === 'proprietaire' ? 'proprietaires' : 'locataires', user.uid);
    
    const userDataToSave: UserData = {
      uid: user.uid,
      email,
      role,
      nom: userData.nom,
      prenom: userData.prenom,
      telephone: userData.telephone
    };
    
    if (role === 'locataire' && userData.proprietaireId && userData.bienId) {
      userDataToSave.proprietaireId = userData.proprietaireId;
      userDataToSave.bienId = userData.bienId;
    }
    
    await setDoc(userDocRef, userDataToSave);

    return userCredential;
  } catch (error) {
    console.error("Error registering user: ", error);
    throw error;
  }
};

export const loginUser = async (email: string, password: string): Promise<UserCredential> => {
  try {
    return await signInWithEmailAndPassword(auth, email, password);
  } catch (error) {
    console.error("Error signing in: ", error);
    throw error;
  }
};

export const logoutUser = async (): Promise<void> => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Error signing out: ", error);
    throw error;
  }
};

export const getCurrentUserRole = async (): Promise<UserRole | null> => {
  const user = auth.currentUser;
  if (!user) return null;

  // Check in proprietaires collection
  const proprietaireDoc = await getDoc(doc(db, 'proprietaires', user.uid));
  if (proprietaireDoc.exists()) return 'proprietaire';
  
  // Check in locataires collection
  const locataireDoc = await getDoc(doc(db, 'locataires', user.uid));
  if (locataireDoc.exists()) return 'locataire';
  
  return null;
};

export const getCurrentUserData = async (): Promise<UserData | null> => {
  const user = auth.currentUser;
  if (!user) return null;
  
  const role = await getCurrentUserRole();
  if (!role) return null;
  
  const collection = role === 'proprietaire' ? 'proprietaires' : 'locataires';
  const userDoc = await getDoc(doc(db, collection, user.uid));
  
  if (userDoc.exists()) {
    return { uid: user.uid, ...userDoc.data() } as UserData;
  }
  
  return null;
};
