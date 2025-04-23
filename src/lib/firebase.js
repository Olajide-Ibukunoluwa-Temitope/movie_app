// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDDE-0Iv3wwyJDIurXRngr0DVmk3dHfBhs",
  authDomain: "movie-app-c55a7.firebaseapp.com",
  projectId: "movie-app-c55a7",
  storageBucket: "movie-app-c55a7.firebasestorage.app",
  messagingSenderId: "567679359686",
  appId: "1:567679359686:web:040a7568b3229a9b93d5c7",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
