// Extract specific functions from the imported modules
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider} from 'firebase/auth'
import { getFirestore } from "firebase/firestore";


// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD5RJO9vuiKFSyH5Wvlc2ORwB6PJAippZs",
  authDomain: "wikieatsp.firebaseapp.com",
  projectId: "wikieatsp",
  storageBucket: "wikieatsp.appspot.com",
  messagingSenderId: "136383227093",
  appId: "1:136383227093:web:fffeb9b73e5b2e1b746e5c",
  measurementId: "G-59KZGZ5HHK",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
export const db = getFirestore(app);

export default app;