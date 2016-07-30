function addhttp(url) {
    if (!/^(?:f|ht)tps?\:\/\//.test(url)) {
        url = "http://" + url;
    }
    return url;
}

function check(){ 
    String.prototype.trim = function() { return this.replace(/^\s+|\s+$/g, ""); }; 
    var inputValue=document.getElementById('url').value; 
    var trimmedTextAreaValue=inputValue.trim(); 
    if(trimmedTextAreaValue!=="") {
        document.getElementById('url').value = addhttp(inputValue);
        document.forms["form"].submit();
    } else {
        alert('You need to enter a valid URL!');
        return false;
    }
} 