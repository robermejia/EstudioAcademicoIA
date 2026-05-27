import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCF84EBvPRP93gGTHNzH9mp04Dn2SUZMvQ",
  authDomain: "estudioacademicoia.firebaseapp.com",
  projectId: "estudioacademicoia",
  storageBucket: "estudioacademicoia.firebasestorage.app",
  messagingSenderId: "409797073748",
  appId: "1:409797073748:web:5c4d0d9966b36858ff06c1"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const googleProvider = new GoogleAuthProvider();

export default app;
