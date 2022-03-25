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