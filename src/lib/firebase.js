// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";


// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_KEY ,
  authDomain: "chatapp-4afe9.firebaseapp.com",
  projectId: "chatapp-4afe9",
  storageBucket: "chatapp-4afe9.appspot.com",
  messagingSenderId: "234279531367",
  appId: "1:234279531367:web:50ba72f6f872d52f7035c2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth()
export const db = getFirestore()
export const storage = getStorage()
