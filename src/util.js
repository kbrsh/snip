var hexu = require('hexu');
var log = function(log, color) {
    if(color) {
        console.log(hexu[color](log));
    } else {
        console.log(hexu.grey(log));
    }
}

var showNotFound = (res) => {
    res.status(404).end('404 Not Found');
}

var formatLinkAPI = function(id, visits, shortURL, longURL) {
  return {
    id: id,
    stats {
      visits: visits
    },
    shortURL: shortURL,
    longURL: longURL
  }
}

module.exports.showNotFound = showNotFound;
module.exports.log = log;
