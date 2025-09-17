// Firebase Connection Test
import { app, auth, db, storage } from './firebase.js';
import { getAuth, signInAnonymously } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';

console.log('🔍 Firebase Connection Test Starting...');

// Test 1: Check Firebase App
console.log('Test 1: Firebase App initialized:', !!app);

// Test 2: Check Auth
console.log('Test 2: Auth service initialized:', !!auth);

// Test 3: Check Firestore
console.log('Test 3: Firestore service initialized:', !!db);

// Test 4: Check Storage
console.log('Test 4: Storage service initialized:', !!storage);

// Test 5: Try anonymous sign in
console.log('Test 5: Attempting anonymous sign in...');
signInAnonymously(auth)
  .then((userCredential) => {
    console.log('✅ Anonymous sign in successful:', userCredential.user.uid);

    // Test 6: Try Firestore write
    console.log('Test 6: Attempting Firestore write...');
    const testDocRef = doc(db, 'test', 'connection-test');
    return setDoc(testDocRef, {
      timestamp: new Date(),
      test: 'connection-test'
    });
  })
  .then(() => {
    console.log('✅ Firestore write successful');

    // Test 7: Try Firestore read
    console.log('Test 7: Attempting Firestore read...');
    const testDocRef = doc(db, 'test', 'connection-test');
    return getDoc(testDocRef);
  })
  .then((docSnap) => {
    if (docSnap.exists()) {
      console.log('✅ Firestore read successful:', docSnap.data());
    } else {
      console.log('❌ Firestore read failed: document does not exist');
    }
  })
  .catch((error) => {
    console.error('❌ Firebase test failed:', error);
    console.error('Error code:', error.code);
    console.error('Error message:', error.message);
  });

export default {}; // Empty export to make it a module
