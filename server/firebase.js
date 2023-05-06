import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import "firebase/compat/auth";


const firebaseConfig = {
  apiKey: "AIzaSyBDxtIoTBzZzkUMg-r8jJ3-Zt49RBf-jFw",
  authDomain: "bethere-1d38e.firebaseapp.com",
  projectId: "bethere-1d38e",
  storageBucket: "bethere-1d38e.appspot.com",
  messagingSenderId: "363222311016",
  appId: "1:363222311016:web:db134b839743a7d20c1bdd",
  measurementId: "G-QQR3NH74Q2"
};

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig)
}

const auth = firebase.auth();
const firestore = firebase.firestore();

export { firebase, auth, firestore };

