import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
import { getAuth, signInAnonymously, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";
import { getFirestore, collection, getDocs, doc, setDoc, deleteDoc } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyCqfiRWDf-U0zvGMwCtEUZ9wtY9CQ849DM",
  authDomain: "paginahefzi-ba.firebaseapp.com",
  projectId: "paginahefzi-ba",
  storageBucket: "paginahefzi-ba.firebasestorage.app",
  messagingSenderId: "405844728190",
  appId: "1:405844728190:web:099b0efd217d70f2c83b2f"
};

let db = null;
let auth = null;
export const appId = 'hefziba-app';

try {
    const app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
    
    // Iniciamos anónimamente por defecto para poder leer datos públicos
    signInAnonymously(auth).catch(e => console.error("Error en auth anónimo", e));
} catch(e) {
    console.error("Error al inicializar Firebase.", e);
}

export { auth, db, signInWithEmailAndPassword, onAuthStateChanged, signOut, collection, getDocs, doc, setDoc, deleteDoc };
