import { getFirestore } from "firebase/firestore";
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: "flashcard-ai-bc367.firebaseapp.com",
  projectId: "flashcard-ai-bc367",
  storageBucket: "flashcard-ai-bc367.appspot.com",
  messagingSenderId: "984002155591",
  appId: "1:984002155591:web:4209ecd77bb0aa44cd8d62"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);