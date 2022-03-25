const searchbar = document.getElementById("searchbar");
const searchButton = document.getElementById("searchIcon");
searchbar.addEventListener("keyup", ({key}) => {
    if (key === "Enter") {
        location.href='#' + searchbar.value.toLowerCase();
    }
});
searchButton.onclick = () => {
    location.href='#' + searchbar.value.toLowerCase();
}

let addWordToLibrary = (parentElement, word, url, plainDef, sciDef) => {

    let wordContainer = document.createElement("div");
    let headerElement = document.createElement("h2");
    let addIcon = document.createElement("img");
    let videoElement = document.createElement("iframe");
    let hpd = document.createElement("h4");
    let hsd = document.createElement("h4");
    let pd = document.createElement("p");
    let sd = document.createElement("p");

    wordContainer.className = "wordContainer";
    headerElement.id = word.toLowerCase();
    headerElement.textContent = word;
    addIcon.className = "addIcon";
    addIcon.src = "../images/addtofoldericon.png";
    addIcon.alt = "addIcon";
    headerElement.appendChild(addIcon);
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

let url = convertLinkToEmbed("https://www.youtube.com/watch?v=oB5v0SBTCrA");
addWordToLibrary(document.getElementById("libraryContainer"), "PleaseWORK", url, "pleaseee", "pls");




// <div class="wordContainer">
//     <h2 id="hello">Hello<image class="addIcon" src="../images/addtofoldericon.png" alt="addIcon"></image></h2>
//     <iframe src="https://www.youtube.com/embed/QB44Vddoi-w"></iframe>
//     <h4>Plain Definition</h4>
//     <p class="plainDesc">Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quos nemo eum voluptatem vel! Labore laudantium, excepturi earum, ipsam sunt deserunt, deleniti totam voluptas dignissimos blanditiis natus alias? Quae magnam explicabo numquam amet unde praesentium voluptatum modi enim quis eveniet laudantium incidunt sapiente aut autem in, earum, molestias eaque ipsa omnis natus non vero et porro architecto? Vitae debitis qui nihil cupiditate?</p>
//     <h4>Scientific Definition</h4>
//     <p class="scientificDesc">Lorem ipsum dolor, sit amet consectetur adipisicing elit. Quo alias rem nam tempore voluptate mollitia, natus nisi. Laboriosam cupiditate, provident iste nihil nesciunt pariatur molestias distinctio beatae adipisci earum. Adipisci!</p>
// </div>