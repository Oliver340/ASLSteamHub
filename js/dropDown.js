function dropDownList() {
    if (document.getElementById("listContainer").style.display == "block") {
        document.getElementById("listContainer").style.display = "none";
    } else {
        document.getElementById("listContainer").style.display = "block";
    }
}

document.addEventListener('mouseup', function(e) {
    if (window.screen.width > 1000) {
        return;
    }
    if (document.getElementById("menuIcon").contains(e.target) || document.getElementById("dropDownContent").contains(e.target)) {
        if (document.getElementById("dropDownContent").style.display == "block"
        && !document.getElementById("dropDownContent").contains(e.target)) {
            document.getElementById("dropDownContent").style.display = "none";
        } else {
            document.getElementById("dropDownContent").style.display = "block";
        }
    } else if (document.getElementById("dropDownContent").style.display == "block") {
        document.getElementById("dropDownContent").style.display = "none";
    }
});

window.addEventListener('resize', function(e) {
    document.getElementById("dropDownContent").style = "";
});