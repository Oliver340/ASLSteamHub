// Function to add a word to the page with delete icon
let addWordToLibrary = (parentElement, word, url, plainDef, sciDef, wordID) => {

    let wordContainer = document.createElement("div");
    let headerElement = document.createElement("h2");
    let deleteIcon = document.createElement("img");
    let videoElement = document.createElement("iframe");
    let hpd = document.createElement("h4");
    let hsd = document.createElement("h4");
    let pd = document.createElement("p");
    let sd = document.createElement("p");

    wordContainer.className = "wordContainer";
    wordContainer.id = wordID;
    headerElement.id = word.toLowerCase();
    headerElement.textContent = word;
    deleteIcon.className = "deleteIcon";
    deleteIcon.src = "../images/deleteicon.png";
    deleteIcon.alt = "deleteIcon";
    headerElement.appendChild(deleteIcon);
    videoElement.src = url;
    hpd.textContent = "Plain Definition";
    hsd.textContent = "Scientific Definition";
    pd.className = "plainDesc";
    sd.className = "scientificDesc";
    pd.textContent = plainDef;
    sd.textContent = sciDef;

    wordContainer.appendChild(headerElement);
    wordContainer.appendChild(videoElement);
    wordContainer.appendChild(hpd);
    wordContainer.appendChild(pd);
    wordContainer.appendChild(hsd);
    wordContainer.appendChild(sd);

    parentElement.innerHTML = '';
    parentElement.appendChild(wordContainer);

}

// Function to make youtube embedded string
let convertLinkToEmbed = (ytURL) => {
    let embedStr = "https://www.youtube.com/embed/";
    let i = 0;
    while (ytURL[i] != "=" && i < ytURL.length) {
    		i++;
    }
    i++;
    while (i < ytURL.length && ytURL[i] != "&") {
    		embedStr += ytURL[i];
        i++;
    }
    return embedStr;
}

const listContainer = document.getElementById("listContainer");
const xhttp = new XMLHttpRequest();
const endPointGetList = "http://localhost:32535/api/getList";
const endPointEditList = "http://localhost:32535/api/editList";

xhttp.onreadystatechange = function() {
    if (xhttp.readyState == 4) {
        if (xhttp.status == 200) {
            let jsonData = JSON.parse(xhttp.response);
            jsonData.forEach(element => {
                let word = element.Word;
                let plainDef = element.PlainDef;
                let sciDef = element.TechDef;
                let url = element.VideoLink;
                let wordID = element.WordID;
                url = convertLinkToEmbed(url);
                addWordToLibrary(listContainer, word, url, plainDef, sciDef, wordID);
            });
        } else if (xhttp.status == 500) {
            let jsonData = JSON.parse(xhttp.response);
            listContainer.innerHTML = jsonData.message;
        }
    }
};

// Sends get req
const getWords = function() {
    let listID = sessionStorage.getItem("listID");

    xhttp.open("GET", endPointGetList, true);
    xhttp.setRequestHeader("Content-Type", "application/JSON");
    xhttp.send(JSON.stringify({ ListID: listID}));
}();

document.getElementById("deleteIcon").addEventListener("click", () => {
    let wordID = this.parentElement.parentElement.id;
    let listID = sessionStorage.getItem("listID");
    editList("DELETE", wordID, listID);
});

// Edits list
const editList = function(operation, wordID, listID) {
    xhttp.open("POST", endPointEditList, true);
    xhttp.setRequestHeader("Content-Type", "application/JSON");
    xhttp.send(JSON.stringify({ token: localStorage.getItem("aslsteamhubtoken"), operation: operation, WordID: wordID, ListID: listID}));
};