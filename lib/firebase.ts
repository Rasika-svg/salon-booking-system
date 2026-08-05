import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  onSnapshot,
  orderBy,
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDeEKKcnGE2mh44xU03R-o2XY0B6KfhZM0",
  authDomain: "salonbooking-bdde8.firebaseapp.com",
  projectId: "salonbooking-bdde8",
  storageBucket: "salonbooking-bdde8.firebasestorage.app",
  messagingSenderId: "402053754623",
  appId: "1:402053754623:web:cc470d3d2c190c700266ca",
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);