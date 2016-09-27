// formats the API into an object given blob of data
var formatLinkAPI = function(id, visits, shortURL, longURL) {
  return {
    id: id,
    stats: {
      visits: visits
    },
    shortURL: shortURL,
    longURL: longURL
  }
}

module.exports = formatLinkAPI;
