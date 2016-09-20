// Require Hexu for Colors
var hexu = require('hexu');


// UTIL function log
// Logs to console, with color specified
var log = function(log, color) {
    if(color) {
        console.log(hexu[color](log));
    } else {
        console.log(hexu.grey(log));
    }
}


// UTIL function showNotFound
// shows 404 page
var showNotFound = (res) => {
    res.status(404).end('404 Not Found');
}


// UTIL function formatLinkAPI
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


// Export utilities
module.exports.showNotFound = showNotFound;
module.exports.formatLinkAPI = formatLinkAPI;
module.exports.log = log;
