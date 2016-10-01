// formats the API into an object given blob of data
var formatUserAPI = function(username, email, links, premium) {
  return {
    username: username,
    email: email,
    premium: premium,
    links: links
  }
}

module.exports = formatUserAPI;
