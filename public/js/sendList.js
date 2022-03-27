const endPointGetList = "http://localhost:32535/api/getList";
let listID = sessionStorage.getItem("listID");
document.getElementById("sendEmail").onclick = function() {
    window.open("mailto:" + document.getElementById("emailEntry").value + "?subject="
    + document.getElementById("subjectEntry").value + "&body=" + document.getElementById("messageEntry").value.replace(/\n\r?/g, '%0D%0A')
    + "\n" + endPointGetList + `/${listID}`);
}