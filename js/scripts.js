/*=============================
  Primary Application Code
=============================*/

var Moon = require("moonjs");
var header = require("./components/header.moon")(Moon);

var app = new Moon({
  el: "#app"
});
