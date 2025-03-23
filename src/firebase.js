// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Configuration Firebase
// Pour obtenir ces valeurs :
// 1. Allez sur https://console.firebase.google.com
// 2. Sélectionnez votre projet
// 3. Cliquez sur ⚙️ (roue dentée) > Project settings
// 4. Dans "Your apps", trouvez votre app web ou créez-en une nouvelle
// 5. Copiez les valeurs de configuration ci-dessous
const firebaseConfig = {
  apiKey: "AIzaSyA0kwbHQKUqax2GGIcmjd25WBDJY-4eMmE",
  authDomain: "habitrack-0.firebaseapp.com",
  databaseURL: "https://habitrack-0-default-rtdb.firebaseio.com",
  projectId: "habitrack-0",
  storageBucket: "habitrack-0.firebasestorage.app",
  messagingSenderId: "735189473535",
  appId: "1:735189473535:web:7e3dc75227b4c9962f54ca",
  measurementId: "G-D5HTBKZ6J1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);

// Collections Firestore
export const COLLECTIONS = {
  PROPRIETAIRES: 'proprietaires',
  LOCATAIRES: 'locataires',
  BIENS: 'biens'
};
