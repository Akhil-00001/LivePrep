
import { initializeApp } from "firebase/app";
import {getAuth, GoogleAuthProvider} from "firebase/auth"
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_APIKEY,
  authDomain: "mockinterview-109c5.firebaseapp.com",
  projectId: "mockinterview-109c5",
  storageBucket: "mockinterview-109c5.firebasestorage.app",
  messagingSenderId: "587494361295",
  appId: "1:587494361295:web:a5d4679ba3451dffe0cfba"
};

// Note: For Google sign-in to work, add localhost and/or 127.0.0.1 to the
// Firebase project Authorized domains list under Authentication -> Settings.

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

const provider = new GoogleAuthProvider()

export {auth , provider}