import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDY7id__qnECAMHnRQt6HCPwHgvHufsGtk",
  authDomain: "enviroclean-419320.firebaseapp.com",
  projectId: "enviroclean-419320",
  storageBucket: "enviroclean-419320.firebasestorage.app",
  messagingSenderId: "156024245048",
  appId: "1:156024245048:web:c240dd90750bb3335d0fcd",
  measurementId: "G-NGVWJ8CPRD"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };
