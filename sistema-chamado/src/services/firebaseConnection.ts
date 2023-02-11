import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

export const firebaseConfig = {
  apiKey: "AIzaSyAfjeaoJZbp-c1xSzTsFVsYi_tyX3uRu6k",
  authDomain: "tickets-e34db.firebaseapp.com",
  projectId: "tickets-e34db",
  storageBucket: "tickets-e34db.appspot.com",
  messagingSenderId: "991049455114",
  appId: "1:991049455114:web:9aa5e69d636656212db1f3",
  measurementId: "G-WPH29GB58Q",
};

const firebaseApp = initializeApp(firebaseConfig);

export const db = getFirestore(firebaseApp);
export const auth = getAuth(firebaseApp);
export const storage = getStorage(firebaseApp);
