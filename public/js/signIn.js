const loginForm = document.querySelector("#login");

let login = function(email, password) {
    //Send login info and store token returned in session storage
}

loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    let user = login(loginForm.emailEntry.value, loginForm.passwordEntry.value);
    console.log(user);
})

const xhttp = new XMLHttpRequest();
const endPoint = "http://localhost:32535/api/signIn";

xhttp.onreadystatechange = function() {
    if (xhttp.readyState == 4) {
        if (xhttp.status == 200) {
            window.location.href = "home.html";
        } else if (xhttp.status == 500) {
            let jsonData = JSON.parse(xhttp.response);
            document.getElementById("loginContainer").innerHTML = jsonData.message;
        }
    }
};

// sign in
const signIn = function(e, p) {
    xhttp.open("POST", endPoint, true);
    xhttp.setRequestHeader("Content-Type", "application/JSON");
    xhttp.send(JSON.stringify({ email: e, password: p}));
}