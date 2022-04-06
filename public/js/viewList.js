//Get the parameters for the get requests to use them in other places
let url = window.location.search;
let query = url.split('?')[1];

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
const endPointGetList = "localhost:32535/api/getList";
const endPointEditList = "localhost:32535/api/editList";

xhttp.onreadystatechange = function() {
    if (xhttp.readyState == 4) {
        if (xhttp.status == 200) {
            let jsonData = JSON.parse(xhttp.response);
            document.getElementsByTagName("h1").appendChild(jsonData[0].ListName);
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

document.getElementById("mailIcon").addEventListener("click", (e) => {
    window.location.href="/sendList?" + query;
})

// Sends get req
const getWords = function() {
    xhttp.open("GET", endPointGetList + "?" + query, true);
    xhttp.setRequestHeader("Content-Type", "application/JSON");
    xhttp.send();
}();