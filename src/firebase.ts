// firebase.js
import { FirebaseApp, FirebaseOptions, initializeApp } from "firebase/app";
import { getFunctions, httpsCallable } from "firebase/functions";
import { Database, getDatabase } from 'firebase/database';
import { getAuth, Auth } from 'firebase/auth';

interface ImportMetaEnv {
  VITE_FIREBASE_API_KEY: string;
  VITE_FIREBASE_AUTH_DOMAIN: string;
  VITE_FIREBASE_PROJECT_ID: string;
  VITE_FIREBASE_STORAGE_BUCKET: string;
  VITE_FIREBASE_MESSAGING_SENDER_ID: string;
  VITE_FIREBASE_APP_ID: string;
  VITE_FIREBASE_MEASUREMENT_ID: string;
}

declare global {
  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }
}
const firebaseConfig:FirebaseOptions = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

const app:FirebaseApp = initializeApp(firebaseConfig);
const functions = getFunctions(app);
const database:Database = getDatabase(app);
const auth:Auth = getAuth(app);

export { functions, httpsCallable,database, auth };

