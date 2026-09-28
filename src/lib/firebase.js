import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged 
} from 'firebase/auth';
import { 
  getFirestore, 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  collection, 
  addDoc, 
  query, 
  where, 
  orderBy, 
  onSnapshot, 
  serverTimestamp 
} from 'firebase/firestore';

// ─────────────────────────────────────────────────────────────
// Firebase Configuration (Loaded strictly from Environment Variables)
// For local dev: populated via .env.local
// For production / Vercel: populated via Vercel Project Settings > Environment Variables
// ─────────────────────────────────────────────────────────────
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSy_DEMO_KEY_CONFIGURE_IN_ENV",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "demo-app.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "demo-app",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "demo-app.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "000000000000",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:000000000000:web:000000000000",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-DEMO000000"
};

/**
 * Indicates whether a real Firebase project is configured via environment variables.
 */
export const isFirebaseConfigured = Boolean(
  import.meta.env.VITE_FIREBASE_API_KEY && 
  import.meta.env.VITE_FIREBASE_PROJECT_ID &&
  !import.meta.env.VITE_FIREBASE_API_KEY.includes('DEMO_KEY')
);

// Safe app initialization
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

/**
 * Check if a user has Admin role.
 * You manually set role: "admin" in your Firestore users collection in Firebase Console.
 */
export const isAdminUser = (user, profile) => {
  if (!user) return false;
  return profile?.role === 'admin' || profile?.isAdmin === true;
};

/**
 * Google Authentication:
 * Registers the user in Firestore users/{uid} with default role: 'user'.
 * In Firebase Console, you can change role to 'admin' to grant admin rights.
 */
export const loginWithGoogle = async () => {
  if (!isFirebaseConfigured) {
    const configError = new Error(
      "Firebase is not configured. Please set your VITE_FIREBASE_* environment variables in .env.local (or in your Vercel deployment settings)."
    );
    configError.code = 'firebase/not-configured';
    throw configError;
  }

  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;

    const userRef = doc(db, 'users', user.uid);
    const snap = await getDoc(userRef);

    if (!snap.exists()) {
      await setDoc(userRef, {
        uid: user.uid,
        displayName: user.displayName || 'Visitor',
        email: user.email,
        photoURL: user.photoURL || null,
        role: 'user', // In Firebase Console, change this to 'admin' for Rajan!
        status: 'pending', // 'pending' | 'allowed' | 'blocked'
        createdAt: serverTimestamp(),
        lastActive: serverTimestamp(),
      });
    } else {
      await updateDoc(userRef, {
        displayName: user.displayName || snap.data().displayName,
        photoURL: user.photoURL || snap.data().photoURL,
        lastActive: serverTimestamp(),
      });
    }

    return user;
  } catch (error) {
    console.error("Google Sign-In Error:", error);
    if (error?.code === 'not-found' || error?.message?.includes('Could not reach Cloud Firestore backend')) {
      const enhancedError = new Error(
        "Cloud Firestore has not been created yet in your Firebase console. Please visit your Firebase Console -> Firestore and click 'Create database' to enable it."
      );
      enhancedError.code = 'firestore/not-provisioned';
      throw enhancedError;
    }
    throw error;
  }
};

export const logoutUser = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("SignOut Error:", error);
    throw error;
  }
};
