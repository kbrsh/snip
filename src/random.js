module.exports = (len) => {
  var str = "";
  for(var i = 0; i < len; i++) {
    var num = Math.floor(Math.random()*36);
    str += num < 10 ? num : String.fromCharCode(num + 87);
  }
  return str;
}
