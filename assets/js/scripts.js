function addhttp(url) {
    if (!/^(?:f|ht)tps?\:\/\//.test(url)) {
        url = "http://" + url;
    }
    if(url.split("")[url.length-1] !== "/") {
      url = url + "/"
    }
    return url;
}

function ValidURL(str) {
  var pattern = new RegExp(/([https|http]:\/\/)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]\/*)/);
  if(!pattern.test(str)) {
    return false;
  } else {
    return true;
  }
}

function check(){
    var inputValue=document.getElementById('url').value;
    if(ValidURL(addhttp(inputValue))) {
        document.getElementById('url').value = addhttp(inputValue);
        document.forms["form"].submit();
    } else {
        document.body.style.backgroundColor = "#D7263D"
        document.body.style.color = "#F5F5F5"
        return false;
    }
}
