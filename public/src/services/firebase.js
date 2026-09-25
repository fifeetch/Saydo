import { initializeApp } from 'firebase/app';
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Firebase Web config is public by design. Firestore and Storage security rules
// enforce that each signed-in user can access only their own records.
export const firebaseApp = initializeApp({
  apiKey: 'AIzaSyCB5veoJG92HC2prIMRhSmH4bMDc6reUK8',
  authDomain: 'saydo-helper.firebaseapp.com',
  projectId: 'saydo-helper',
  storageBucket: 'saydo-helper.firebasestorage.app',
  messagingSenderId: '901650622770',
  appId: '1:901650622770:web:8b65149ffedb8f1cbccf2b',
});

export const auth = getAuth(firebaseApp);
export const db = getFirestore(firebaseApp);
export const storage = getStorage(firebaseApp);
export function subscribeToUser(callback) { return onAuthStateChanged(auth, callback); }
export async function signIn(email, password) { await signInWithEmailAndPassword(auth, email, password); }
export async function signOutUser() { await signOut(auth); }
export function readableFirebaseError(error) {
  const code = error?.code || '';
  if (['auth/operation-not-allowed','auth/admin-restricted-operation'].includes(code)) return 'La connexion par e-mail et mot de passe n’est pas activée dans Firebase Authentication.';
  if (['auth/invalid-credential','auth/user-not-found','auth/wrong-password'].includes(code)) return 'Adresse e-mail ou mot de passe incorrect.';
  if (code === 'auth/invalid-email') return 'Cette adresse e-mail n’est pas valide.';
  if (code === 'auth/too-many-requests') return 'Trop de tentatives. Attends un peu avant de réessayer.';
  if (['permission-denied','storage/unauthorized'].includes(code)) return 'Firebase a refusé l’accès. Vérifie les règles de sécurité Firestore et Storage.';
  if (['storage/bucket-not-found','storage/no-default-bucket'].includes(code)) return 'Le stockage Firebase n’est pas encore prêt. Les notes et les listes restent disponibles.';
  if (code === 'auth/popup-blocked') return 'La fenêtre de connexion a été bloquée. Autorise la fenêtre de connexion Google puis réessaie.';
  if (code === 'auth/popup-closed-by-user') return 'La fenêtre de connexion a été fermée avant la fin.';
  if (code === 'unavailable' || code.startsWith('auth/network')) return 'Connexion au service impossible pour le moment. Vérifie Internet puis réessaie.';
  return error?.message || 'Une erreur est survenue. Réessaie.';
}
