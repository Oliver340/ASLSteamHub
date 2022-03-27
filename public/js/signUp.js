let signUpForm = document.querySelector("#signUp");

signUpForm.addEventListener("submit", (e) => {
    e.preventDefault();
    if (signUpForm.passwordEntry.value == signUpForm.confirmPasswordEntry.value) {
        signUp(signUpForm.fullName.value, signUpForm.emailEntry.value, signUpForm.passwordEntry.value);
    }
})

const xhttp = new XMLHttpRequest();
const endPoint = "http://localhost:32535/api/signup";

xhttp.onreadystatechange = function() {
    if (xhttp.readyState == 4) {
        if (xhttp.status == 200) {
            let jsonData = JSON.parse(xhttp.response);
            window.location.href = "home.html";
            localStorage.setItem('token', jsonData.token);
        } else if (xhttp.status == 500) {
            let jsonData = JSON.parse(xhttp.response);
            document.getElementById("signUpContainer").innerHTML = jsonData.message;
        }
    }
};

// signup
const signUp = function(n, e, p) {
    xhttp.open("POST", endPoint, true);
    xhttp.setRequestHeader("Content-Type", "application/JSON");
    xhttp.send(JSON.stringify({ email: e, name: n, password: p}));
}