import { 
  collection, addDoc, getDoc, getDocs, updateDoc, doc, 
  query, where, deleteDoc, setDoc 
} from 'firebase/firestore';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser
} from 'firebase/auth';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { db, auth, storage, COLLECTIONS } from '../firebase';
import { Proprietaire, Locataire, Bien, UserRole, User } from '../types/types';

// Export auth pour l'utiliser dans App.tsx
export { auth };

// Services d'authentification
export const inscription = async (
  email: string, 
  password: string, 
  role: UserRole,
  userData: Partial<Proprietaire | Locataire>
) => {
  try {
    console.log('Début de l\'inscription...');
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const uid = userCredential.user.uid;
    console.log('Utilisateur créé dans Firebase Auth:', uid);
    
    const collectionRef = role === 'proprietaire' ? COLLECTIONS.PROPRIETAIRES : COLLECTIONS.LOCATAIRES;
    await setDoc(doc(db, collectionRef, uid), {
      ...userData,
      id: uid,
    });
    console.log('Document créé dans Firestore');

    return uid;
  } catch (error) {
    console.error('Erreur lors de l\'inscription:', error);
    throw error;
  }
};

export const connexion = async (email: string, password: string) => {
  try {
    console.log('Tentative de connexion...');
    const result = await signInWithEmailAndPassword(auth, email, password);
    console.log('Connexion réussie:', result.user.uid);
    return result;
  } catch (error) {
    console.error('Erreur lors de la connexion:', error);
    throw error;
  }
};

export const deconnexion = async () => {
  try {
    console.log('Tentative de déconnexion...');
    await signOut(auth);
    console.log('Déconnexion réussie');
  } catch (error) {
    console.error('Erreur lors de la déconnexion:', error);
    throw error;
  }
};

export const getCurrentUser = (): Promise<User | null> => {
  return new Promise((resolve) => {
    console.log('Vérification de l\'état d\'authentification...');
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          console.log('Utilisateur Firebase trouvé:', firebaseUser.uid);
          // Vérifier dans quelle collection l'utilisateur existe
          const proprietaireDoc = await getDoc(doc(db, COLLECTIONS.PROPRIETAIRES, firebaseUser.uid));
          const locataireDoc = await getDoc(doc(db, COLLECTIONS.LOCATAIRES, firebaseUser.uid));
          
          if (proprietaireDoc.exists()) {
            console.log('Utilisateur trouvé dans la collection propriétaires');
            const data = proprietaireDoc.data();
            resolve({
              uid: firebaseUser.uid,
              email: firebaseUser.email!,
              role: 'proprietaire' as UserRole,
              ...data
            });
          } else if (locataireDoc.exists()) {
            console.log('Utilisateur trouvé dans la collection locataires');
            const data = locataireDoc.data();
            resolve({
              uid: firebaseUser.uid,
              email: firebaseUser.email!,
              role: 'locataire' as UserRole,
              bienId: data.bienId,
              ...data
            });
          } else {
            console.log('Utilisateur non trouvé dans les collections');
            resolve(null);
          }
        } catch (error) {
          console.error('Erreur lors de la récupération de l\'utilisateur:', error);
          resolve(null);
        }
      } else {
        console.log('Aucun utilisateur authentifié');
        resolve(null);
      }
      unsubscribe();
    });
  });
};

// Services Biens
export const getBien = async (bienId: string): Promise<Bien | null> => {
  try {
    const bienDoc = await getDoc(doc(db, COLLECTIONS.BIENS, bienId));
    if (bienDoc.exists()) {
      return { id: bienDoc.id, ...bienDoc.data() } as Bien;
    }
    return null;
  } catch (error) {
    console.error('Erreur lors de la récupération du bien:', error);
    throw error;
  }
};

export const ajouterBien = async (bien: Omit<Bien, 'id'>) => {
  try {
    const bienRef = await addDoc(collection(db, COLLECTIONS.BIENS), {
      ...bien,
      statut: 'vacant',
      locataireId: null
    });
    return bienRef.id;
  } catch (error) {
    throw error;
  }
};

export const getBiensProprietaire = async (proprietaireID: string) => {
  const q = query(collection(db, COLLECTIONS.BIENS), where('proprietaireID', '==', proprietaireID));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const getBiensVacants = async () => {
  try {
    const q = query(collection(db, COLLECTIONS.BIENS), where('statut', '==', 'vacant'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Bien));
  } catch (error) {
    console.error('Erreur lors de la récupération des biens vacants:', error);
    throw error;
  }
};

// Services Locataire
export const getLocatairesBien = async (bienID: string) => {
  const q = query(collection(db, COLLECTIONS.LOCATAIRES), where('bienId', '==', bienID));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const supprimerLocataire = async (locataireID: string, bienID: string) => {
  await deleteDoc(doc(db, COLLECTIONS.LOCATAIRES, locataireID));
  await updateDoc(doc(db, COLLECTIONS.BIENS, bienID), {
    statut: 'vacant'
  });
};

// Services Storage
export const uploadFile = async (file: File, path: string) => {
  const storageRef = ref(storage, path);
  await uploadBytes(storageRef, file);
  return await getDownloadURL(storageRef);
};

export const deleteFile = async (path: string) => {
  const storageRef = ref(storage, path);
  await deleteObject(storageRef);
};

export const supprimerBien = async (bienId: string): Promise<void> => {
  try {
    const bienRef = doc(db, "biens", bienId);
    
    // Récupérer les infos du bien
    const bienSnap = await getDoc(bienRef);
    
    if (!bienSnap.exists()) {
      throw new Error("Le bien n'existe pas.");
    }

    const bienData = bienSnap.data();

    // Vérifier si le bien est bien "vacant"
    if (bienData.statut !== "vacant") {
      throw new Error("Ce bien est encore occupé. Change son statut avant de le supprimer.");
    }

    // Supprimer le bien
    await deleteDoc(bienRef);
  } catch (error: any) {
    console.error("Erreur lors de la suppression du bien:", error);
    throw new Error(error.message || "Erreur lors de la suppression du bien");
  }
}; 