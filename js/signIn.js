import {login} from "./allPages";

const loginForm = document.querySelector("#login");

loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    login(loginForm.emailEntry.value, loginForm.passwordEntry.value);
})