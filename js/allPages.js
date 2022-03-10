import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, addDoc, deleteDoc, doc, CollectionReference } from "firebase/firestore";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "firebase/auth";


const firebaseConfig = {
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
let getDocumentsFromCollection = function(collectionName) {
    getDocs(collection(db, collectionName))
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

let addDocumentToCollection = async function(collectionName, document) {
    await addDoc(collection(db, collectionName), document).then(() => {
    })
    .catch((err) => {
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

let createNewUser =  function(email, password) {
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

let signUpForm = document.querySelector("#signUp");
if (signUpForm != null) {
    signUpForm.addEventListener("submit", (e) => {
        e.preventDefault();
        if (signUpForm.passwordEntry.value == signUpForm.confirmPasswordEntry.value) {
            createUserWithEmailAndPassword(auth, signUpForm.emailEntry.value, signUpForm.passwordEntry.value)
            .then((userCredentials) => {
                addDocumentToCollection("Users", {
                    uid: userCredentials.user.uid,
                    name: signUpForm.fullName.value,
                    admin: false
                });
            })
            .catch((err) => {
                console.log(err.message);
            });
        }
    })
}

let wordSubmissionContainer = document.querySelector("#wordSubmissionContainer");
if (wordSubmissionContainer != null) {
    wordSubmissionContainer.addEventListener("submit", (e) => {
        e.preventDefault();
        if (wordSubmissionContainer.wordEntry.value == null
            || wordSubmissionContainer.linkEntry.value == null
            || wordSubmissionContainer.scientificDefinitionEntry.value == null
            || wordSubmissionContainer.plainDefinitionEntry.value == null) {
                alert("Please fill all fields");
        } else {
            addDocumentToCollection("Pending Review", {
                word: wordSubmissionContainer.wordEntry.value,
                link: wordSubmissionContainer.linkEntry.value,
                scientificDefinition: wordSubmissionContainer.scientificDefinitionEntry.value,
                plainDefinition: wordSubmissionContainer.plainDefinitionEntry.value
            });
            wordSubmissionContainer.reset()
        }
    })
}

// const userListPage = document.querySelector("#userListPage");
// if (userListPage != null) {
//     if user.
// }

//export { createNewUser, logout, login, deleteDocumentFromCollection, getDocumentsFromCollection };