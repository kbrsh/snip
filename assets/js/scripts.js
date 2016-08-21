function addhttp(url) {
    if (!/^(?:f|ht)tps?\:\/\//.test(url)) {
        url = "http://" + url;
    }
    return url;
}

function ValidURL(str) {
  var pattern = new RegExp("(http|ftp|https)://[\w-]+(\.[\w-]*)+([\w.,@?^=%&amp;:/~+#-]*[\w@?^=%&amp;/~+#-])?");
  if(!pattern.test(str)) {
    document.body.style.backgroundColor = "#D7263D"
    document.body.style.color = "#F5F5F5"
    return false;
  } else {
    return true;
  }
}

function check(){
    var inputValue=document.getElementById('url').value;

    if(ValidURL(inputValue)) {
        document.getElementById('url').value = addhttp(inputValue);
        document.forms["form"].submit();
    } else {
      document.body.style.backgroundColor = "#D7263D"
      document.body.style.color = "#F5F5F5"
      return false;
    }
}
