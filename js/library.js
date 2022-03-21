const node = document.getElementById("searchbar");
node.addEventListener("keyup", ({key}) => {
    if (key === "Enter") {
        location.href='#' + node.value.toLowerCase();
        console.log("enter pressed");
    }
});