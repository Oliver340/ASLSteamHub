import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, addDoc, deleteDoc, doc } from "firebase/firestore";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "firebase/auth";

//Yes this isn't stored correctly, no I didn't fix this, yes I could have with the time I had, I just chose to not fail other classes
const firebaseConfig = {
    // "apiKey" : "AIzaSyBH0J5yRoKq8979s2zhHM8Mdpt7t0ik_cQ",
    // "authDomain" : "aslsteamhub-bced8.firebaseapp.com",
    // "projectId" : "aslsteamhub-bced8",
    // "storageBucket" : "aslsteamhub-bced8.appspot.com",
    // "messagingSenderId" : "763735607907",
    // "appId" : "1:763735607907:web:270c1098ba2319379c8656",
    // "measurementId" : "G-2JP7Q1BN9V"

    apiKey : process.env.FIREBASE_API_KEY,
    authDomain : process.env.FIREBASE_AUTH_DOMAIN,
    projectId : process.env.FIREBASE_PROJECT_ID,
    storageBucket : process.env.FIREBASE_STORAGE_BUCKET,
    messagingSenderId : process.env.FIREBASE_MESSAGING_SENDER_ID,
    appId : process.env.FIREBASE_APP_ID,
    measurementId : process.env.FIREBASE_MEASUREMENT_ID
}

const pendingCollection = "Pending Review";
const publishedCollection = "Main";
const adminCollection = "Admin";
// Initialize Firebase and functionality we're using
initializeApp(firebaseConfig);
const db = getFirestore();
const auth = getAuth();

//Store references to the collections
const pendingReference = collection(db, pendingCollection);
const publishedReference = collection(db, publishedCollection);
const adminReference = collection(db, adminCollection);

//Get all the documents within a collection
let getDocumentsFromCollection = function(collectionReference) {
    getDocs(collectionName)
        .then((snapshot) => {
            let documents = [];
            snapshot.docs.forEach((doc) => {
                documents.push({ ...doc.data(), id: doc.id })
            })
            console.log(documents);
            return documents;
        })
        .catch(err => {
            console.log(err.message);
        });
}

let deleteDocumentFromCollection = function(collectionReference, documentID) {
    const documentReference = doc(db, collectionReference, documentID);
    deleteDoc(documentReference);
}

let login = function(email, password) {
    let user = null;
    signInWithEmailAndPassword(auth, email, password)
    .then((userCredentials) => {
        user = userCredentials;
        return user;
    })
    .catch((err) => {
        console.log(err.message);
    });
}

let logout = function() {
    signOut(auth).then(() => {
    })
    .catch((err) => {
        console.log(err.message);
    })
}

let createNewUser = function(email, password) {
    let user = null;
    createUserWithEmailAndPassword(auth, email, password)
        .then((userCredentials) => {
            user = userCredentials;
            return user;
        })
        .catch((err) => {
            console.log(err.message);
        });
}

onAuthStateChanged(auth, (user) => {
    console.log("User status changed: ", user);
})

const loginForm = document.querySelector("#login");

if (loginForm != null) {
    loginForm.addEventListener("submit", (e) => {
        e.preventDefault();
        let user = login(loginForm.emailEntry.value, loginForm.passwordEntry.value);
        console.log(user);
    })
}

//export { createNewUser, logout, login, deleteDocumentFromCollection, getDocumentsFromCollection };