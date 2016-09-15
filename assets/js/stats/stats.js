// Util for Making GET request
function httpGet(theUrl, callback) {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() {
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
            callback(xmlHttp.responseText);
    }
    xmlHttp.open("GET", theUrl, true); // true for asynchronous
    xmlHttp.send(null);
}

if(document.getElementById("visits").innerHTML === "1") {
    document.getElementById("p").innerHTML = "person";
    document.getElementById("h").innerHTML = "has";
}
