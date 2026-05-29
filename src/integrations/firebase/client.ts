import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCiusm_c07Um2wHoWW1UAoomPveXG0UNOo",
  authDomain: "red-eyes-2e18d.firebaseapp.com",
  projectId: "red-eyes-2e18d",
  storageBucket: "red-eyes-2e18d.firebasestorage.app",
  messagingSenderId: "35523953528",
  appId: "1:35523953528:web:d07fc26bad882894207e8d",
  measurementId: "G-MT8EWHJ7GG",
};

export const firebaseApp = getApps().length ? getApp() : initializeApp(firebaseConfig);
export const firebaseAuth = getAuth(firebaseApp);
export const firestore = getFirestore(firebaseApp);
