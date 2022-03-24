import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyBH0J5yRoKq8979s2zhHM8Mdpt7t0ik_cQ",
    authDomain: "aslsteamhub-bced8.firebaseapp.com",
    projectId: "aslsteamhub-bced8",
    storageBucket: "aslsteamhub-bced8.appspot.com",
    messagingSenderId: "763735607907",
    appId: "1:763735607907:web:270c1098ba2319379c8656",
    measurementId: "G-2JP7Q1BN9V"
  };

const pendingCollection = "";
const publishedCollection = "";
// Initialize Firebase and functionality we're using
initializeApp(firebaseConfig);
const db = getFirestore();

//Store references to the collections
const pendingReference = collection(db, pendingCollection);
const publishedReference = collection(db, publishedCollection);

//Get all the documents within a collection
getDocs(publishedReference)
    .then((snapshot) => {
        console.log(snapshot.docs);
    })