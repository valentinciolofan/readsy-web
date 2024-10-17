// firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, FacebookAuthProvider, OAuthProvider, signInWithPopup, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyD0Odo6uHvKJcAWMYXZjlRBS7u-q56YREc",
  authDomain: "readsy-e4208.firebaseapp.com",
  projectId: "readsy-e4208",
  storageBucket: "readsy-e4208.appspot.com",
  messagingSenderId: "392214324306",
  appId: "1:392214324306:web:2c02204a3d329462472b8b",
  measurementId: "G-JTBG0VY2NM"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const storage = getStorage(app);
const db = getFirestore(app);
// Providers
const googleProvider = new GoogleAuthProvider();
const fbProvider = new FacebookAuthProvider();
const appleProvider = new OAuthProvider('apple.com');

export { db, storage, auth, googleProvider, fbProvider, appleProvider, createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup };
