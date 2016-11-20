function getReq(url, callback) {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() {
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
            callback(xmlHttp.responseText);
    }
    xmlHttp.open("GET", url, true);
    xmlHttp.send(null);
}

function extractBaseURL(url) {
  return url.match(/^https?\:\/\/([^\/?#]+)(?:[\/?#]|$)/i)[1];
}

function fillData(data) {
  document.getElementById("report-longURL").innerHTML = extractBaseURL(data.longURL);
}

var urlID = window.location.href.split("/")[3];
getReq("/" + urlID + "/api", function(data) {
  data = JSON.parse(data);
  if(data.error) {
    document.getElementById("report").classList.add("hide");
    document.getElementById("header").classList.add("text-center");
    document.getElementById("header").innerHTML = "404";
  }

  if(!data.error) {
    fillData(data);
  }
});
