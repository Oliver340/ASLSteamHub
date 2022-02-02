import { getAuth, signInWithEmailAndPassword, signOut } from "./firebase";

const auth = getAuth();
signIn = () => {
    let email = document.getElementById("emailEntry");
    let password = document.getElementById("passwordEntry");
    if (document.getElementById("confirmPasswordEntry") !== password) {
        return null;
    }
    signInWithEmailAndPassword(auth, email, password).then(
        (userCredential) => {
            const user = userCredential
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log(String(errorCode).concat(": ", String(errorMessage)));
          });
}

signOut = () => {
    signOut(auth).then(() => {
        console.log("Sign out successful!");
    }).catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(String(errorCode).concat(": ", String(errorMessage)));
    })
}