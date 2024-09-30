// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
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

export const auth = getAuth();
export const db = getFirestore(app);
export const googleAuthProvider = new GoogleAuthProvider();
