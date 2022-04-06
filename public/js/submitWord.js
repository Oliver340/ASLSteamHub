let wordSubmissionContainer = document.querySelector("#wordSubmissionContainer");
wordSubmissionContainer.addEventListener("submit", (e) => {
    e.preventDefault();
    if (wordSubmissionContainer.wordEntry.value == null
        || wordSubmissionContainer.linkEntry.value == null
        || wordSubmissionContainer.scientificDefinitionEntry.value == null
        || wordSubmissionContainer.plainDefinitionEntry.value == null) {
            alert("Please fill all fields");
    } else {
        addDocumentToCollection("Pending Review", {
            word: wordSubmissionContainer.wordEntry.value,
            link: wordSubmissionContainer.linkEntry.value,
            scientificDefinition: wordSubmissionContainer.scientificDefinitionEntry.value,
            plainDefinition: wordSubmissionContainer.plainDefinitionEntry.value
        });
        wordSubmissionContainer.reset()
    }
})

const xhttp = new XMLHttpRequest();
const endPoint = "localhost:32535/api/addWord";

xhttp.onreadystatechange = function() {
    if (xhttp.readyState == 4) {
        if (xhttp.status == 200) {
            let jsonData = JSON.parse(xhttp.response);
            wordSubmissionContainer.innerHTML = jsonData.message;
        } else if (xhttp.status == 500) {
            let jsonData = JSON.parse(xhttp.response);
            wordSubmissionContainer.innerHTML = jsonData.message;
        }
    }
};

// Post a word to db
const addDocumentToCollection = function(message, wordObj) {
    xhttp.open("POST", endPoint, true);
    xhttp.setRequestHeader("Content-Type", "application/JSON");
    xhttp.send(JSON.stringify({ token: localStorage.getItem("aslsteamhubtoken"), Word: wordObj.word, PlainDef: wordObj.plainDefinition,
        TechDef: wordObj.scientificDefinition, VideoLink: wordObj.link}));
}