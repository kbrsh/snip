function check(){ 
    String.prototype.trim = function() { return this.replace(/^\s+|\s+$/g, ""); }; 
    var inputValue=document.getElementById('url').value; 
    var trimmedTextAreaValue=inputValue.trim(); 
    if(trimmedTextAreaValue!="") { 
        document.forms["form"].submit();
    } else {
        alert('You need to enter a URL!');
        return false;
    }
} 