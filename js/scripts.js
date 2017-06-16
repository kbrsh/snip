/*=============================
  Primary Application Code
=============================*/

var Moon = require("moonjs");
require("./components/app.moon")(Moon);

new Moon({
  el: "#app"
});
