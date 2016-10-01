var path = require("path");

module.exports = function(req, res) {
  // Send index.html file
  res.sendFile(path.resolve(__dirname + '/../views/index.html'));
}
