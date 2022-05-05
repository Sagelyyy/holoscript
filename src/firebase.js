// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from 'firebase/auth'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAq7Q6k53I8nTqFHHAsMUJLHDUjlOkEnoQ",
  authDomain: "holoscript-b4ec7.firebaseapp.com",
  projectId: "holoscript-b4ec7",
  storageBucket: "holoscript-b4ec7.appspot.com",
  messagingSenderId: "993425163741",
  appId: "1:993425163741:web:eba863e3fc4c9c05be2234",
  measurementId: "G-19T9NNQYZX"
};

const firebase = initializeApp(firebaseConfig);
const db = getFirestore(firebase)
const auth = getAuth(firebase)
// const auth = firebase.auth();
// const storage = firebase.storage();

export { db, auth };