import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage"; // Include Firebase storage

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAqXpEHPBjvKlcRXeCS5Rc9BYpdhUAm0vk",
  authDomain: "test-b56d3.firebaseapp.com",
  projectId: "test-b56d3",
  storageBucket: "test-b56d3.appspot.com",
  messagingSenderId: "456295953744",
  appId: "1:456295953744:web:03b3c4840bb0bda556a855",
  measurementId: "G-BKZPS8G535"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const db = getFirestore(app);
export const firebaseAuth = getAuth(app);
export const storage = getStorage(app); // Initialize Firebase storage
