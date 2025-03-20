
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
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

export { app, analytics };
