import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { collection, getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyDIGpra9sZShCCcj76dEqsKgt3A6kq23do",
    authDomain: "workflow-2-eb647.firebaseapp.com",
    projectId: "workflow-2-eb647",
    storageBucket: "workflow-2-eb647.appspot.com",
    messagingSenderId: "55913499790",
    appId: "1:55913499790:web:5d97345601a19ba0200ddf",
    measurementId: "G-WSEL2FQRZ2"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const workflow = collection(db, "workflow");