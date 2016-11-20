function getReq(url, callback) {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() {
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
            callback(xmlHttp.responseText);
    }
    xmlHttp.open("GET", url, true);
    xmlHttp.send(null);
}

var urlID = window.location.href.split("/")[3];

getReq("/" + urlID + "/api", function(data) {
  if(data.error) {
    
  }
});
