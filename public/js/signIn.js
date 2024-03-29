const loginForm = document.querySelector("#login");

loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    signIn(loginForm.emailEntry.value, loginForm.passwordEntry.value);
})

const xhttp = new XMLHttpRequest();
const endPoint = "/api/signIn";

xhttp.onreadystatechange = function() {
    if (xhttp.readyState == 4) {
        if (xhttp.status == 200) {
            let jsonData = JSON.parse(xhttp.response);
            window.location.href = "/home";
            localStorage.setItem('aslsteamhubtoken', jsonData.token);
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