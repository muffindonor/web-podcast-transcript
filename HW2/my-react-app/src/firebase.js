// firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDOgRezkPPUzm-DvCwcRVsyRC3sFBtdIEs",
  authDomain: "webdb-394c6.firebaseapp.com",
  projectId: "webdb-394c6",
  storageBucket: "webdb-394c6.appspot.com",
  messagingSenderId: "674684006044",
  appId: "1:674684006044:web:dd281f89b3ee2964784759",
  measurementId: "G-20MDX020G7"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };