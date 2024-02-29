import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { collection, getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    // apiKey: "AIzaSyC-q6pTa2lST7G1g8KGshrGja2EFzDlJM0",
    // authDomain: "workflow-9f4ff.firebaseapp.com",
    // projectId: "workflow-9f4ff",
    // storageBucket: "workflow-9f4ff.appspot.com",
    // messagingSenderId: "479413635993",
    // appId: "1:479413635993:web:7ee27390ee697ad03be108",
    // measurementId: "G-1NWFSCR34F"
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