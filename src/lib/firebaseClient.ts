import { initializeApp, getApps } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  GithubAuthProvider,
  type Auth,
} from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || '',
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || '',
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || '',
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || '',
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || '',
};

const hasConfig = Boolean(
  firebaseConfig.apiKey && firebaseConfig.authDomain && firebaseConfig.projectId
);
const shouldInit = typeof window !== 'undefined' && hasConfig;
const app = getApps().length ? getApps()[0] : shouldInit ? initializeApp(firebaseConfig) : null;

export const firebaseReady = Boolean(app);
export const firebaseAuth: Auth | null = app ? getAuth(app) : null;
export const firestore: Firestore | null = app ? getFirestore(app) : null;
export const googleProvider: GoogleAuthProvider | null = app ? new GoogleAuthProvider() : null;
export const githubProvider: GithubAuthProvider | null = app ? new GithubAuthProvider() : null;
