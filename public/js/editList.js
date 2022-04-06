//Get the parameters for the get requests to use them in other places
let url = window.location.search;
let query = url.split('?')[1];
document.querySelector("#addWord").addEventListener("click", (e) => {
    window.location.href = "library?" + query;
});
document.querySelector("#updateList").addEventListener("click", (e) => {
    e.preventDefault();
    let ListID = query.split("=")[1];
    editList("UPDATE", null, ListID, document.querySelector("#listName").value);
});
document.querySelector("#mailIcon").addEventListener("click", (e) => {
    window.location.href = "sendList?" + query;
})

// Function to add a word to the page with delete icon
let addWordToList = (parentElement, word, url, plainDef, sciDef, wordID) => {

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
const endPointGetList = "/api/getList";
const endPointEditList = "/api/editList";

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
            document.querySelectorAll(".deleteIcon").forEach(element => {
                element.addEventListener("click", () => {
                    let wordID = element.parentElement.parentElement.id;
                    let ListID = query.split("=")[1];
                    editList("DELETE", wordID, ListID, document.querySelector("#listName").value);
                    element.parentElement.parentElement.parentElement.removeChild(element.parentElement.parentElement);
                });
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

// Sends get req
const getWords = function() {
    xhttp.open("GET", endPointGetList + "?" + query, true);
    xhttp.setRequestHeader("Content-Type", "application/JSON");
    xhttp.send();
}();

// Edits list
const editList = function(operation, wordID, listID, listName) {
    xhttp.open("POST", endPointEditList, true);
    xhttp.setRequestHeader("Content-Type", "application/JSON");
    xhttp.send(JSON.stringify({ token: localStorage.getItem("aslsteamhubtoken"), operation: operation, WordID: wordID, ListID: listID, ListName: listName }));
};