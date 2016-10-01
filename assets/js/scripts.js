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

// See if URL contains "snipit.ga"
function containsSelfURL(str) {
  if(str.indexOf("snipit.ga") !== -1) {
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

// UTIL for clearing input to prevent multiple spam entries
function clearInput() {
  document.getElementById('url').value = "";
}

// Function called by form on submit to check and validate URL submitted
function check(e){
    var inputValue=document.getElementById('url').value;
    if(ValidURL(addhttp(inputValue)) && containsSelfURL(inputValue)) {

        document.getElementById('url').value = addhttp(inputValue);

        httpGet("/api/shorten/v1?url=" + document.getElementById("url").value, function(url) {
          if(!url.error) {
            var urlObj = JSON.parse(url);
            var successModal = document.createElement("div");
            successModal.classList.add("modal");
            successModal.innerHTML = `<div id='success' class='center'><div class='closeModal' onClick='this.parentElement.parentElement.style.display="none"'><img src='./img/x.svg'/></div><p>Nice! Share it with your friends:</p> <input type='text' onClick='this.setSelectionRange(0, this.value.length)'' value='' readonly id='shortened-url'/></div>`;
            document.body.appendChild(successModal);
            document.getElementById("shortened-url").value = urlObj.shortURL;
            clearInput();
          } else {
            document.getElementById("error").innerHTML = "Nice try! The URL is still invalid!";
          }
        });

        return false;
    } else {
        document.getElementById("error").innerHTML = "Whoops! The URL is invalid!";
        return false;
    }
}

// Show modal on login click
document.getElementById("login").addEventListener("click", function() {
  var loginModal = document.createElement("div");
  loginModal.classList.add("modal");
  loginModal.innerHTML = `<div class='center'><div class='closeModal' onClick='this.parentElement.parentElement.style.display="none"'><img src='./img/x.svg'/></div><form action="/auth/login" method="POST">

  </form></div>`;
});
