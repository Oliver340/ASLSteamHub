const loginForm = document.querySelector("#login");

let login = function(email, password) {
    //Send login info and store token returned in session storage
}

loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    let user = login(loginForm.emailEntry.value, loginForm.passwordEntry.value);
    console.log(user);
})