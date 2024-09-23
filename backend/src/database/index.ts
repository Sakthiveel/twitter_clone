// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBUd8P7c8tVnOBVeOmCHGCeaDPIbEpB6wc",
  authDomain: "twitterclone-f5c0f.firebaseapp.com",
  projectId: "twitterclone-f5c0f",
  storageBucket: "twitterclone-f5c0f.appspot.com",
  messagingSenderId: "518714010661",
  appId: "1:518714010661:web:a3edb6711fb46a625ea3cc",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
