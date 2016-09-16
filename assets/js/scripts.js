// Function which adds a http protocol if it doesn't exist
function addhttp(url) {
    if (!/^(?:f|ht)tps?\:\/\//.test(url)) {
        url = "http://" + url;
    }
    if(url.split("")[url.length-1] !== "/") {
      url = url + "/"
    }
    return url;
}

// RegEx for checking if URL is valid
function ValidURL(str) {
  var pattern = new RegExp(/([https|http]:\/\/)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]\/*)/);
  if(!pattern.test(str)) {
    return false;
  } else {
    return true;
  }
}

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

// Function called by form on submit to check and validate URL submitted
function check(e){
    var inputValue=document.getElementById('url').value;
    if(ValidURL(addhttp(inputValue))) {
        document.getElementById('url').value = addhttp(inputValue);
        httpGet("/shorten/v1?url=" + document.getElementById("url").value, function(url) {
          document.getElementById("success").style.opacity = "100";
          var urlObj = JSON.parse(url);
          document.getElementById("shortened-url").value = urlObj.shortURL;
        });
        return false;
    } else {
        document.getElementById("error").innerHTML = "Whoops! The URL is invalid!";
        return false;
    }
}
