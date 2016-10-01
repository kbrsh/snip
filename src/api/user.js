// formats the API into an object given blob of data
var formatUserAPI = function(username, email, avatar, links, premium) {
  return {
    username: username,
    email: email,
    avatar: avatar,
    premium: premium,
    links: links
  }
}

module.exports = formatUserAPI;
