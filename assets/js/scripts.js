function check(){ 
    String.prototype.trim = function() { return this.replace(/^\s+|\s+$/g, ""); }; 
    var inputValue=document.getElementById('url').value; 
    var trimmedTextAreaValue=inputValue.trim(); 
    if(trimmedTextAreaValue!=="") {
        if (inputValue.split("").slice(0, 6).join("") !== "http://" || inputValue.split("").slice(0, 7).join("") !== "https://") {
            inputValue = "http://" + inputValue;
        }
        document.forms["form"].submit();
    } else {
        alert('You need to enter a valid URL!');
        return false;
    }
} 