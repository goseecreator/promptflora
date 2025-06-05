// lib/firebase.ts
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyC9-E2t_JPgQdzKSfpAI9Do0k0Z5b3NRm8",
    authDomain: "promptflora.firebaseapp.com",
    projectId: "promptflora",
    storageBucket: "promptflora.firebasestorage.app",
    messagingSenderId: "219766606229",
    appId: "1:219766606229:web:0c2a17ca1176ede12b4e9c",
    measurementId: "G-GKRFDW2TPF"
  };

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
