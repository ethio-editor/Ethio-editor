import { initializeApp } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDDgQT6W2OULkePu9KMlfc04u8v2We40OI",
  authDomain: "etio-editor.firebaseapp.com",
  projectId: "etio-editor",
  storageBucket: "etio-editor.appspot.com",
  messagingSenderId: "480278426413",
  appId: "1:480278426413:web:bcbae220defd44b7f819a4"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
