
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA0kwbHQKUqax2GGIcmjd25WBDJY-4eMmE",
  authDomain: "habitrack-0.firebaseapp.com",
  projectId: "habitrack-0",
  storageBucket: "habitrack-0.firebasestorage.app",
  messagingSenderId: "735189473535",
  appId: "1:735189473535:web:7e3dc75227b4c9962f54ca",
  measurementId: "G-D5HTBKZ6J1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

export { app, analytics, db, auth, storage };
