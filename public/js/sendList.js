let url = window.location.search;
let query = url.split('?')[1];

document.getElementById("sendEmail").onclick = function() {
    window.open("mailto:" + document.getElementById("emailEntry").value + "?subject="
    + document.getElementById("subjectEntry").value + "&body=" + document.getElementById("messageEntry").value.replace(/\n\r?/g, '%0D%0A')
    + "aslsteamhub.commons.bcit.ca/viewList?" + query);
}