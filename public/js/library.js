//Get the parameters for the get requests to use them in other places
let url = window.location.search;
let query = url.split('?')[1];
let value = null;
console.log(query);
if (query) {
    value = query.split('=');
}

const endPointEditList = "http://localhost:32535/api/editList";

// Function to add a word to the page
let addWordToLibrary = (parentElement, word, url, plainDef, sciDef, wordID) => {

    let wordContainer = document.createElement("div");
    let headerElement = document.createElement("h2");
    let addIcon = document.createElement("img");
    let videoElement = document.createElement("iframe");
    let hpd = document.createElement("h4");
    let hsd = document.createElement("h4");
    let pd = document.createElement("p");
    let sd = document.createElement("p");

    wordContainer.className = "wordContainer";
    wordContainer.id = wordID;
    headerElement.id = word.toLowerCase();
    headerElement.textContent = word;
    if (localStorage.getItem("aslsteamhubtoken") != "") {
        if (value) {
            addIcon.className = "addIcon";
            addIcon.src = "../images/addtofoldericon.png";
            addIcon.alt = "addIcon";
            addIcon.addEventListener("click", (e) => {
                xhttp.open("POST", endPointEditList, true);
                xhttp.setRequestHeader("Content-Type", "application/JSON");
                xhttp.send(JSON.stringify({ token: localStorage.getItem("aslsteamhubtoken"), operation: "ADD", WordID: wordID, ListID: value[1] }));
            });
            headerElement.appendChild(addIcon);
        }
    }
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

const libraryContainer = document.getElementById("libraryContainer");
const xhttp = new XMLHttpRequest();
const endPoint = "http://localhost:32535/api/library";
const endPointSearch = "http://localhost:32535/api/searchLibrary";

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
                addWordToLibrary(libraryContainer, word, url, plainDef, sciDef, wordID);
            });
        } else if (xhttp.status == 201) {
            alert("List updated successfully!");
        } else if (xhttp.status == 500) {
            let jsonData = JSON.parse(xhttp.response);
            libraryContainer.innerHTML = jsonData.message;
        }
    }
};

// Sends get req
const getWords = function() {
    if (value) {
        xhttp.open("GET", endPoint + "?" + query, true);
    } else {
        xhttp.open("GET", endPoint, true);
    }
    xhttp.send();
}();

const searchbar = document.getElementById("searchbar");
const searchButton = document.getElementById("searchIcon");
// Functions to search
searchbar.addEventListener("keyup", ({key}) => {
    if (key === "Enter") {
        searchDB(searchbar.value);
    }
});
searchButton.onclick = () => {
    searchDB(searchbar.value);
}

// Search db
const searchDB = function(searchTerm) {
    xhttp.open("GET", endPointSearch, true);
    xhttp.setRequestHeader("Content-Type", "application/JSON");
    xhttp.send(JSON.stringify({ SearchTerm: searchTerm}));
};