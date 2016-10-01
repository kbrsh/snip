var path = require("path");

module.exports = function(req, res) {
  // Send index.html file if user not present
  if(req.user) {
    res.redirect("/dashboard");
  } else {
    res.sendFile(path.resolve(__dirname + "/../views/index.html"));
  }
}
