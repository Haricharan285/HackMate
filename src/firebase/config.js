
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDyBEP8oKHnRH9T7YxqmD_edqlbWRLkOVU",
  authDomain: "hackmate-35d7e.firebaseapp.com",
  projectId: "hackmate-35d7e",
  storageBucket: "hackmate-35d7e.firebasestorage.app",
  messagingSenderId: "759731478624",
  appId: "1:759731478624:web:92e3137c41a2984dae2305",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
