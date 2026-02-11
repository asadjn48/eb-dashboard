import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAG8FcQAzEqqz-AF9F8RJnEJUQJotfT42A",
  authDomain: "eb-dashboard-9f41e.firebaseapp.com",
  projectId: "eb-dashboard-9f41e",
  storageBucket: "eb-dashboard-9f41e.firebasestorage.app",
  messagingSenderId: "769245649412",
  appId: "1:769245649412:web:d064a9d71f6c06d61db351"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);