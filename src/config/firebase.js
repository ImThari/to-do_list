import { initializeApp } from 'firebase/app';
import { 
    getAuth, 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, 
    onAuthStateChanged,
    GoogleAuthProvider, 
    signInWithPopup, 
    signOut
} from 'firebase/auth';
import { getDatabase, ref, set, onValue } from 'firebase/database';

const firebaseConfig = {
///////////
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
const signInWithGoogle = async () => {
    try {
        await signInWithPopup(auth, googleProvider);
    } catch (error) {
        console.error("Erreur lors de la connexion avec Google :", error);
    }
};

export {
  db,
  auth,
  googleProvider,
  signInWithGoogle,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  ref,
  set,
  onValue
};
