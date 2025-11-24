import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyCk5H3YnBXpZrwTuMJJhFfFH-hWZyyewIg",
    authDomain: "startosedge-1bcd3.firebaseapp.com",
    projectId: "startosedge-1bcd3",
    storageBucket: "startosedge-1bcd3.firebasestorage.app",
    messagingSenderId: "995272833532",
    appId: "1:995272833532:web:d0d220d5b433a57762da79",
    measurementId: "G-R2XVSDYGYS"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();

export default app;

