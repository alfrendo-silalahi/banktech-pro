// Firebase Configuration
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database';

// TODO: Replace with your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyAMcnLig14yaq5HENgaTBeLp130m-BJOdg",
  authDomain: "banktech-pro.firebaseapp.com",
  databaseURL: "https://banktech-pro-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "banktech-pro",
  storageBucket: "banktech-pro.firebasestorage.app",
  messagingSenderId: "777645520319",
  appId: "1:777645520319:web:49dfbfe8761e9c7c48dd0a"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
export const auth = getAuth(app);
export const database = getDatabase(app);
export default app;