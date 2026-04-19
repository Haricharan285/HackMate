// src/firebase/config.js
// ============================================================
// 🔧 SETUP INSTRUCTIONS
// ============================================================
// 1. Go to https://console.firebase.google.com
// 2. Create a new project (e.g. "hackmate")
// 3. Enable Authentication → Email/Password
// 4. Create a Firestore Database (start in test mode)
// 5. Go to Project Settings → Your apps → Add Web App
// 6. Copy the firebaseConfig values below
// 7. Replace the placeholder values with your real config
// ============================================================

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
