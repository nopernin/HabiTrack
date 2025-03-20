
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
  where 
} from 'firebase/firestore';
import { Tenant } from '@/utils/types';
import { updatePropertyStatus, PropertyStatus } from './property.service';

export interface FirestoreTenant {
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  bienId: string;
  proprietaireId: string;
  debutBail: Date;
  finBail: Date;
  montantLoyer: number;
  montantDepot: number;
  jourPaiement: number; // jour du mois où le loyer est dû
  createdAt: Date;
  updatedAt: Date;
}

export const addTenant = async (tenant: Omit<FirestoreTenant, 'createdAt' | 'updatedAt'>): Promise<string> => {
  try {
    const tenantData: FirestoreTenant = {
      ...tenant,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    const docRef = await addDoc(collection(db, 'locataires'), tenantData);
    
    // Update property status to OCCUPIED
    await updatePropertyStatus(tenant.bienId, PropertyStatus.OCCUPIED);
    
    return docRef.id;
  } catch (error) {
    console.error("Error adding tenant: ", error);
    throw error;
  }
};

export const getTenantById = async (tenantId: string): Promise<FirestoreTenant & { id: string } | null> => {
  try {
    const docRef = doc(db, 'locataires', tenantId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as FirestoreTenant & { id: string };
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error getting tenant: ", error);
    throw error;
  }
};

export const getTenantsByProperty = async (propertyId: string): Promise<(FirestoreTenant & { id: string })[]> => {
  try {
    const q = query(collection(db, 'locataires'), where("bienId", "==", propertyId));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => {
      return { id: doc.id, ...doc.data() } as FirestoreTenant & { id: string };
    });
  } catch (error) {
    console.error("Error getting property tenants: ", error);
    throw error;
  }
};

export const getTenantsByOwner = async (ownerId: string): Promise<(FirestoreTenant & { id: string })[]> => {
  try {
    const q = query(collection(db, 'locataires'), where("proprietaireId", "==", ownerId));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => {
      return { id: doc.id, ...doc.data() } as FirestoreTenant & { id: string };
    });
  } catch (error) {
    console.error("Error getting owner tenants: ", error);
    throw error;
  }
};

export const updateTenant = async (tenantId: string, tenantData: Partial<Omit<FirestoreTenant, 'createdAt' | 'updatedAt'>>): Promise<void> => {
  try {
    const tenantRef = doc(db, 'locataires', tenantId);
    await updateDoc(tenantRef, {
      ...tenantData,
      updatedAt: new Date()
    });
  } catch (error) {
    console.error("Error updating tenant: ", error);
    throw error;
  }
};

export const deleteTenant = async (tenantId: string, propertyId: string): Promise<void> => {
  try {
    // Delete tenant document
    await deleteDoc(doc(db, 'locataires', tenantId));
    
    // Update property status to VACANT
    await updatePropertyStatus(propertyId, PropertyStatus.VACANT);
  } catch (error) {
    console.error("Error deleting tenant: ", error);
    throw error;
  }
};

// Map Firestore tenant to app Tenant type
export const mapFirestoreTenantToTenant = (firestoreTenant: FirestoreTenant & { id: string }): Tenant => {
  return {
    id: firestoreTenant.id,
    firstName: firestoreTenant.prenom,
    lastName: firestoreTenant.nom,
    email: firestoreTenant.email,
    phone: firestoreTenant.telephone,
    propertyId: firestoreTenant.bienId,
    leaseStart: new Date(firestoreTenant.debutBail),
    leaseEnd: new Date(firestoreTenant.finBail),
    rentAmount: firestoreTenant.montantLoyer,
    depositAmount: firestoreTenant.montantDepot,
    rentDueDay: firestoreTenant.jourPaiement
  };
};

// Map app Tenant type to Firestore tenant
export const mapTenantToFirestoreTenant = (
  tenant: Tenant, 
  proprietaireId: string
): Omit<FirestoreTenant, 'createdAt' | 'updatedAt'> => {
  return {
    prenom: tenant.firstName,
    nom: tenant.lastName,
    email: tenant.email,
    telephone: tenant.phone,
    bienId: tenant.propertyId,
    proprietaireId: proprietaireId,
    debutBail: tenant.leaseStart,
    finBail: tenant.leaseEnd,
    montantLoyer: tenant.rentAmount,
    montantDepot: tenant.depositAmount,
    jourPaiement: tenant.rentDueDay
  };
};
