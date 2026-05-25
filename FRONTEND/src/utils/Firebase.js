import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_APIKEY,
  authDomain: "fypnoxvora.firebaseapp.com",
  projectId: "fypnoxvora",
  storageBucket: "fypnoxvora.appspot.com",
  messagingSenderId: "613701855298",
  appId: "1:613701855298:web:a9de69fa689d49239ba5db"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

export const provider = new GoogleAuthProvider();
provider.setCustomParameters({
  prompt: "select_account"
});