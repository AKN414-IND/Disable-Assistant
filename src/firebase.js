import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBArVNvvJtMjLXShDktGVgyGIaAeLyDyl8",
  authDomain: "disable-7a185.firebaseapp.com",
  projectId: "disable-7a185",
  storageBucket: "disable-7a185.appspot.com",
  messagingSenderId: "674614420975",
  appId: "1:674614420975:web:8017cea6d3e4edb067421a",
  measurementId: "G-H15GGMSRT3"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);