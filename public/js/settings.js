const updateProfileForm = document.querySelector("#changeProfile");

updateProfileForm.addEventListener("change", (e) => {
    if (updateProfileForm.passwordEntry.value != updateProfileForm.confirmPasswordEntry.value) {
        updateProfileForm.submitForm.disabled = true;
    } else {
        updateProfileForm.submitForm.disabled = false;
    }
})

updateProfileForm.addEventListener("submit", (e) => {
    e.preventDefault();
    if (updateProfileForm.fullName.value != user.fullName) {
        user.fullName = updateProfileForm.fullName.value;
    }
    if (updateProfileForm.email.value != user.email) {
        user.email = updateProfileForm.email.value;
    }
    sendPassword(user.fullName, user.email);
})

const xhttp = new XMLHttpRequest();
const endPoint = "http://localhost:32535/api/profile";

xhttp.onreadystatechange = function() {
    if (xhttp.readyState == 4) {
        if (xhttp.status == 200) {
            let jsonData = JSON.parse(xhttp.response);
            jsonData.forEach(element => {
                let name = element.FullName;
                let email = element.Email;
                updateProfileForm.fullName.value = name;
                updateProfileForm.email.value = email;
            });
        } else if (xhttp.status == 500) {
            let jsonData = JSON.parse(xhttp.response);
            document.getElementsByTagName('h2') = jsonData.message;
        }
    }
};

// Gets profile
const getProfile = function() {
    xhttp.open("POST", endPoint, true);
    xhttp.setRequestHeader("Content-Type", "application/JSON");
    xhttp.send(JSON.stringify({ token: localStorage.getItem("aslsteamhubtoken"), operation: "GET"}));
}();

// Updates profile
const sendPassword = function(name, email) {
    xhttp.open("POST", endPoint, true);
    xhttp.setRequestHeader("Content-Type", "application/JSON");
    xhttp.send(JSON.stringify({ token: localStorage.getItem("aslsteamhubtoken"), operation: "UPDATE", FullName: name, Email: email}));
};