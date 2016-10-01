module.exports = function(req, res) {
  // Send index.html file
  res.sendFile(__dirname + '/views/index.html');
}
