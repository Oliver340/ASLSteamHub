document.getElementById("sendEmail").onclick = function() {
    window.open("mailto:" + document.getElementById("emailEntry").value + "?subject="
    + document.getElementById("subjectEntry").value + "&body=" + document.getElementById("messageEntry").value.replace(/\n\r?/g, '%0D%0A')
    + "some link to the list or something here");
}

const listContainer = document.getElementById("listContainer");
const xhttp = new XMLHttpRequest();
const endPointGetList = "http://localhost:32535/api/getList";

xhttp.onreadystatechange = function() {
    if (xhttp.readyState == 4) {
        if (xhttp.status == 200) {
            let jsonData = JSON.parse(xhttp.response);
            document.querySelector("#listName").value = jsonData[0].ListName;
            jsonData.forEach(element => {
                let word = element.Word;
                let plainDef = element.PlainDef;
                let sciDef = element.TechDef;
                let url = element.VideoLink;
                let wordID = element.WordID;
                url = convertLinkToEmbed(url);
                addWordToList(listContainer, word, url, plainDef, sciDef, wordID);
            });
        } else if (xhttp.status == 201) {
            let response = JSON.parse(xhttp.response);
            console.log(response.message);
        } else if (xhttp.status == 500) {
            let jsonData = JSON.parse(xhttp.response);
            listContainer.innerHTML = jsonData.message;
        }
    }
};

let url = window.location.search;
let query = url.split('?')[1];

const getWords = function() {
    xhttp.open("GET", endPointGetList + "?" + query, true);
    xhttp.setRequestHeader("Content-Type", "application/JSON");
    xhttp.send();
}();