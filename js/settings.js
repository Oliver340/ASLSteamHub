const updateProfileForm = document.querySelector("#changeProfile");

//get user and populate form with existing data

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
    //POST user data to the db, replacing the current user data.
})