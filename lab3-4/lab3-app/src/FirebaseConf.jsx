import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyDn2MbVtnpCk5gwtaIQRBIOR7GggQ5VB-M",
    authDomain: "lab4-authorisation.firebaseapp.com",
    projectId: "lab4-authorisation",
    storageBucket: "lab4-authorisation.firebasestorage.app",
    messagingSenderId: "582366981072",
    appId: "1:582366981072:web:3f6cce19d82029c5b2e7d5",
    measurementId: "G-1Q2E1665P5"
};


const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export default {auth, db} ;