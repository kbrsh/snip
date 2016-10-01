module.exports = function(req, res) {
  res.render('dashboard', { user: req.user, links: req.user.links.split("#") });
}
