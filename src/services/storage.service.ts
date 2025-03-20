
import { storage } from '../firebase';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';

export const uploadFile = async (file: File, path: string): Promise<string> => {
  try {
    const storageRef = ref(storage, path);
    const snapshot = await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);
    return downloadURL;
  } catch (error) {
    console.error("Error uploading file: ", error);
    throw error;
  }
};

export const deleteFile = async (path: string): Promise<void> => {
  try {
    const storageRef = ref(storage, path);
    await deleteObject(storageRef);
  } catch (error) {
    console.error("Error deleting file: ", error);
    throw error;
  }
};

export const uploadPropertyImage = async (file: File, proprietaireId: string, propertyId: string): Promise<string> => {
  const path = `proprietaires/${proprietaireId}/biens/${propertyId}/images/${file.name}`;
  return uploadFile(file, path);
};

export const uploadPropertyDocument = async (file: File, proprietaireId: string, propertyId: string, documentType: string): Promise<string> => {
  const path = `proprietaires/${proprietaireId}/biens/${propertyId}/documents/${documentType}/${file.name}`;
  return uploadFile(file, path);
};

export const uploadTenantDocument = async (file: File, proprietaireId: string, propertyId: string, tenantId: string, documentType: string): Promise<string> => {
  const path = `proprietaires/${proprietaireId}/biens/${propertyId}/locataires/${tenantId}/documents/${documentType}/${file.name}`;
  return uploadFile(file, path);
};
