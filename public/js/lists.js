document.getElementById("addList").onclick = function() {
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth()+1;//January is 0!`

    var yyyy = today.getFullYear();
    if(dd<10){dd='0'+dd}
    if(mm<10){mm='0'+mm}
    var today = mm+'/'+dd+'/'+yyyy;
    
    let element = document.createElement("div");
    element.className = "lists";
    element.textContent = "List" + num + " - " + today;

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

    document.getElementById("listContainer").append(element);
}

const listContainer = document.getElementById("listContainer");

let updateLists = (listName) => {
    let element = document.createElement("div");
    element.className = "lists";
    element.textContent = listName;

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
const endPoint = "http://localhost:32535/api/getUserLists";

xhttp.onreadystatechange = function() {
    if (xhttp.readyState == 4) {
        if (xhttp.status == 200) {
            let jsonData = JSON.parse(xhttp.response);
            jsonData.forEach(element => {
                let listName = element.ListName;
                updateLists(listName);
            });
        } else if (xhttp.status == 500) {
            libraryContainer.innerHTML = "Could not get lists from database";
        }
    }
};

const getList = function() {
    xhttp.open("POST", endPoint, true);
    xhttp.setRequestHeader("Content-Type", "application/JSON");
    xhttp.send(JSON.stringify({ token: localStorage.getItem("aslsteamhubtoken")}));
}();