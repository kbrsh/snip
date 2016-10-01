var path = require("path");
var ejs = require("ejs");

module.exports = function(req, res) {
  // Send index.html file
  res.render("index", {user: req.user})
}
