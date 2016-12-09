var link = document.getElementById("link");

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

function randomLink(cb) {
  getReq("/api/links", function(data) {
    data = JSON.parse(data);
    cb(data[Math.floor(Math.random()*data.length)]);
  });
}

function seed() {
  randomLink(function(data) {
    link.innerHTML = extractBaseURL(data.longURL).replace(/https?:\/\//gi, "").replace("www.", "");
  });
}
