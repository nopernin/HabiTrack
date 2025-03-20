
import { db } from '../firebase';
import { 
  collection, 
  doc, 
  addDoc, 
  getDoc, 
  getDocs, 
  updateDoc, 
  deleteDoc, 
  query, 
  where,
  DocumentReference,
  DocumentData 
} from 'firebase/firestore';
import { Property, PropertyStatus, PropertyType } from '@/utils/types';

export interface FirestoreProperty {
  nom: string;
  type: PropertyType;
  adresse: string;
  ville: string;
  codePostal: string;
  pays: string;
  nombrePieces: number;
  surface: number;
  loyerMensuel: number;
  statut: PropertyStatus;
  description?: string;
  imageUrl: string;
  proprietaireId: string;
  createdAt: Date;
  updatedAt: Date;
}

export const addProperty = async (property: Omit<FirestoreProperty, 'createdAt' | 'updatedAt'>): Promise<string> => {
  try {
    const propertyData: FirestoreProperty = {
      ...property,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    const docRef = await addDoc(collection(db, 'biens'), propertyData);
    return docRef.id;
  } catch (error) {
    console.error("Error adding property: ", error);
    throw error;
  }
};

export const getPropertyById = async (propertyId: string): Promise<FirestoreProperty & { id: string } | null> => {
  try {
    const docRef = doc(db, 'biens', propertyId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as FirestoreProperty & { id: string };
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error getting property: ", error);
    throw error;
  }
};

export const getPropertiesByOwner = async (ownerId: string): Promise<(FirestoreProperty & { id: string })[]> => {
  try {
    const q = query(collection(db, 'biens'), where("proprietaireId", "==", ownerId));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => {
      return { id: doc.id, ...doc.data() } as FirestoreProperty & { id: string };
    });
  } catch (error) {
    console.error("Error getting owner properties: ", error);
    throw error;
  }
};

export const updatePropertyStatus = async (propertyId: string, status: PropertyStatus): Promise<void> => {
  try {
    const propertyRef = doc(db, 'biens', propertyId);
    await updateDoc(propertyRef, { 
      statut: status,
      updatedAt: new Date()
    });
  } catch (error) {
    console.error("Error updating property status: ", error);
    throw error;
  }
};

export const updateProperty = async (propertyId: string, propertyData: Partial<Omit<FirestoreProperty, 'createdAt' | 'updatedAt' | 'proprietaireId'>>): Promise<void> => {
  try {
    const propertyRef = doc(db, 'biens', propertyId);
    await updateDoc(propertyRef, {
      ...propertyData,
      updatedAt: new Date()
    });
  } catch (error) {
    console.error("Error updating property: ", error);
    throw error;
  }
};

export const deleteProperty = async (propertyId: string): Promise<void> => {
  try {
    await deleteDoc(doc(db, 'biens', propertyId));
  } catch (error) {
    console.error("Error deleting property: ", error);
    throw error;
  }
};

// Map Firestore property to app Property type
export const mapFirestorePropertyToProperty = (firestoreProperty: FirestoreProperty & { id: string }): Property => {
  return {
    id: firestoreProperty.id,
    name: firestoreProperty.nom,
    address: firestoreProperty.adresse,
    city: firestoreProperty.ville,
    postalCode: firestoreProperty.codePostal,
    country: firestoreProperty.pays,
    type: firestoreProperty.type,
    rooms: firestoreProperty.nombrePieces,
    area: firestoreProperty.surface,
    rent: firestoreProperty.loyerMensuel,
    imageUrl: firestoreProperty.imageUrl,
    status: firestoreProperty.statut,
    description: firestoreProperty.description
  };
};

// Map app Property type to Firestore property
export const mapPropertyToFirestoreProperty = (property: Property, proprietaireId: string): Omit<FirestoreProperty, 'createdAt' | 'updatedAt'> => {
  return {
    nom: property.name,
    type: property.type,
    adresse: property.address,
    ville: property.city,
    codePostal: property.postalCode,
    pays: property.country,
    nombrePieces: property.rooms,
    surface: property.area,
    loyerMensuel: property.rent,
    statut: property.status,
    description: property.description,
    imageUrl: property.imageUrl,
    proprietaireId: proprietaireId
  };
};
