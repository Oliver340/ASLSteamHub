let signUpForm = document.querySelector("#signUp");

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