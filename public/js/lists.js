//Function adds list to the page
// document.getElementById("addList").onclick = function() {
//     var today = new Date();
//     var dd = today.getDate();
//     var mm = today.getMonth()+1;//January is 0!`

//     var yyyy = today.getFullYear();
//     if(dd<10){dd='0'+dd}
//     if(mm<10){mm='0'+mm}
//     var today = mm+'/'+dd+'/'+yyyy;
    
//     let element = document.createElement("div");
//     element.className = "lists";
//     element.textContent = "List" + num + " - " + today;

//     let image = document.createElement("img");
//     image.id = "mailIcon";
//     image.src = "../images/mailicon.png";
//     image.alt = "mailIcon";
//     image.onclick = function() {location.href='sendList.html';};

//     element.append(image);

    
//     let image2 = document.createElement("img");
//     image2.id = "editIcon";
//     image2.src = "../images/editicon.png";
//     image2.alt = "editIcon";
//     image2.onclick = function() {location.href='editList.html';};

//     element.append(image2);

//     document.getElementById("listContainer").append(element);
// }

const listContainer = document.getElementById("listContainer");

//Function loads list to page
let updateLists = (listName, listID) => {
    let element = document.createElement("div");
    element.className = "lists";
    element.textContent = listName;
    element.id = listID;

    let image = document.createElement("img");
    image.id = "mailIcon";
    image.src = "../images/mailicon.png";
    image.alt = "mailIcon";
    image.onclick = function() {location.href='sendList.html';};

    element.append(image);

    
    let image2 = document.createElement("img");
    image2.id = "editIcon";
    image2.src = "../images/editicon.png";
    image2.alt = "editIcon";
    image2.onclick = function() {location.href='editList.html';};

    element.append(image2);

    listContainer.append(element);
}

const xhttp = new XMLHttpRequest();
const endPointGetLists = "http://localhost:32535/api/getUserLists";
const endPointPostList = "http://localhost:32535/api/createNewList";

xhttp.onreadystatechange = function() {
    if (xhttp.readyState == 4) {
        if (xhttp.status == 200) {
            let jsonData = JSON.parse(xhttp.response);
            jsonData.forEach(element => {
                let listName = element.ListName;
                let listID = element.ListID;
                updateLists(listName, listID);
            });
        } else if (xhttp.status == 500) {
            let jsonData = JSON.parse(xhttp.response);
            listContainer.innerHTML = jsonData.message;
        }
    }
};

// Get request for lists
const getList = function() {
    xhttp.open("POST", endPointGetLists, true);
    xhttp.setRequestHeader("Content-Type", "application/JSON");
    let userToken = localStorage.getItem("aslsteamhubtoken");
    xhttp.send(JSON.stringify({ token: userToken}));
}();

document.querySelectorAll(".editIcon").forEach(item => {
    item.addEventListener("click", (e) => {
        let listID = this.parentElement.id;
        sessionStorage.setItem('listID', listID);
    });
});

document.querySelectorAll(".mailIcon").forEach(item => {
    item.addEventListener("click", (e) => {
        let listID = this.parentElement.id;
        sessionStorage.setItem('listID', listID);
    });
});

// Post request to add list
document.getElementById("addList").onclick = function () {
    let listname = "List";
    xhttp.open("POST", endPointPostList, true);
    xhttp.setRequestHeader("Content-Type", "application/JSON");
    xhttp.send(JSON.stringify({ token: localStorage.getItem("aslsteamhubtoken"), ListName: listname}));
};