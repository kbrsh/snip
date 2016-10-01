module.exports = function(req, res) {
  res.render('profile', { user: req.user });
}
