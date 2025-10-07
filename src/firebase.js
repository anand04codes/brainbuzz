
// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator, doc } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// ✅ Firebase config from environment
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID,
};

// Log the actual config values for debugging
console.log('Firebase Config Loaded:', {
  apiKey: firebaseConfig.apiKey ? 'Present' : 'Missing',
  authDomain: firebaseConfig.authDomain ? 'Present' : 'Missing',
  projectId: firebaseConfig.projectId ? 'Present' : 'Missing',
  storageBucket: firebaseConfig.storageBucket ? 'Present' : 'Missing',
  messagingSenderId: firebaseConfig.messagingSenderId ? 'Present' : 'Missing',
  appId: firebaseConfig.appId ? 'Present' : 'Missing',
  measurementId: firebaseConfig.measurementId ? 'Present' : 'Missing',
});

// 🔒 Validate .env keys
const missingKeys = Object.entries(firebaseConfig)
  .filter(([_, value]) => !value)
  .map(([key]) => key);

if (missingKeys.length > 0) {
  console.warn("⚠️ Missing Firebase environment variables:", missingKeys);
}

// ✅ Initialize Firebase app
const app = initializeApp(firebaseConfig);
console.log('Firebase: App initialized successfully');

// ✅ Firebase services
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

console.log('Firebase: Services initialized', {
  auth: !!auth,
  db: !!db,
  storage: !!storage
});

// ✅ Connect to Firestore Emulator in development
// To use Firebase Emulator locally:
// 1. Install Firebase CLI: npm install -g firebase-tools
// 2. Start Firestore emulator: npm run firestore:emulator (or firebase emulators:start --only firestore)
// 3. Set NODE_ENV=development (default in React dev mode)
// 4. Emulator runs on localhost:8080 by default
// 5. Data is stored locally and doesn't affect production Firestore
if (process.env.NODE_ENV === 'development') {
  try {
    connectFirestoreEmulator(db, 'localhost', 8080);
    console.log('Firebase: Connected to Firestore Emulator');
  } catch (error) {
    console.warn('Firebase: Firestore Emulator connection failed (might already be connected):', error.message);
  }
}

// Debug authentication state changes
auth.onAuthStateChanged((user) => {
  console.log('Firebase: Auth state changed', {
    user: user ? { uid: user.uid, email: user.email } : null,
    isAuthenticated: !!user
  });
});

// Debug Firestore connection
console.log('Firebase: Testing Firestore connection...');
try {
  doc(db, '_test', 'connection');
  console.log('Firebase: Firestore reference created successfully');
} catch (error) {
  console.error('Firebase: Firestore connection test failed:', error);
}

export { app, auth, db, storage };
