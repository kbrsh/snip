function addhttp(url) {
    if (!/^(?:f|ht)tps?\:\/\//.test(url)) {
        url = "http://" + url;
    }
    return url;
}

function ValidURL(str) {
  var pattern = new RegExp('^(https?:\/\/)?'+ // protocol
    '((([a-z\d]([a-z\d-]*[a-z\d])*)\.)+[a-z]{2,}|'+ // domain name
    '((\d{1,3}\.){3}\d{1,3}))'+ // OR ip (v4) address
    '(\:\d+)?(\/[-a-z\d%_.~+]*)*'+ // port and path
    '(\?[;&a-z\d%_.~+=-]*)?'+ // query string
    '(\#[-a-z\d_]*)?$','i'); // fragment locater
  if(!pattern.test(str)) {
    alert("Please enter a valid URL.");
    return false;
  } else {
    return true;
  }
}

function check(){
    String.prototype.trim = function() { return this.replace(/^\s+|\s+$/g, ""); };
    var inputValue=document.getElementById('url').value;
    var trimmedTextAreaValue=inputValue.trim();
    if(trimmedTextAreaValue!=="" || ValidURL(trimmedTextAreaValue) === true) {
        document.getElementById('url').value = addhttp(inputValue);
        document.forms["form"].submit();
    } else {
        document.body.style.backgroundColor = "#D7263D"
        document.body.style.color = "#F5F5F5"
        return false;
    }
}
