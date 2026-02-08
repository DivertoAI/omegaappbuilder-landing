import { initializeApp, getApps } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  GithubAuthProvider,
} from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

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

export const firebaseAuth = app
  ? getAuth(app)
  : (null as unknown as ReturnType<typeof getAuth>);
export const firestore = app
  ? getFirestore(app)
  : (null as unknown as ReturnType<typeof getFirestore>);
export const googleProvider = app
  ? new GoogleAuthProvider()
  : (null as unknown as GoogleAuthProvider);
export const githubProvider = app
  ? new GithubAuthProvider()
  : (null as unknown as GithubAuthProvider);
