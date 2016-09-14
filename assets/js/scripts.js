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

// Function called by form on submit to check and validate URL submitted
function check(e){
    var inputValue=document.getElementById('url').value;
    if(ValidURL(addhttp(inputValue))) {
        document.getElementById('url').value = addhttp(inputValue);
        document.forms["form"].submit();
    } else {
        document.getElementById("error").innerHTML = "Whoops! The URL is invalid!";
        return false;
    }
}

document.getElementById("form").addEventListener("submit", function(e) {
  e.preventDefault();
});
