import { initializeApp } from "firebase/app";
import { getStorage, ref } from 'firebase/storage';
import { getFirestore, doc, collection, setDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyBkScDCo844bZadPiluUlMIWCPq0-kIvGE",
    authDomain: "couscous-3bcaf.firebaseapp.com",
    projectId: "couscous-3bcaf",
    storageBucket: "couscous-3bcaf.appspot.com",
    messagingSenderId: "616384549014",
    appId: "1:616384549014:web:ecceebc93290e979ee32b7"
};

const app = initializeApp(firebaseConfig)
export const auth = getAuth(app);
export const storage = getStorage(app);
export const firestore = getFirestore(app);

export const storageRef = (address) => ref(storage, address);
export const docRef = (collectionName, docName) => doc(firestore, collectionName, docName);
export const collectionRef = (collectionName) => collection(firestore, collectionName);

export const save =  async (collectionName, docName, data) => {
    await setDoc(docRef(collectionName, docName), data, { merge: true });
}