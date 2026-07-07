// firebase.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getAuth, GoogleAuthProvider } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyAAONTVcHjM2U3O4zXklahSAwinLVDKI5w",
  authDomain: "prediciones-de-maiz-ee22c.firebaseapp.com",
  projectId: "prediciones-de-maiz-ee22c",
  storageBucket: "prediciones-de-maiz-ee22c.firebasestorage.app",
  messagingSenderId: "985007785097",
  appId: "1:985007785097:web:754af3b5611b4476e33258",
  measurementId: "G-BHF799DL1B"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export { auth, googleProvider };
