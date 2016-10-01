var storage = require("../models/storage.js");

module.exports = function(req, res) {
  var links = req.user.links.split("#");
  res.render('dashboard', {user: req.user, links: links});
}
