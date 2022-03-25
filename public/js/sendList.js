document.getElementById("sendEmail").onclick = function() {
    window.open("mailto:" + document.getElementById("emailEntry").value + "?subject="
    + document.getElementById("subjectEntry").value + "&body=" + document.getElementById("messageEntry").value.replace(/\n\r?/g, '%0D%0A')
    + "some link to the list or something here");
}