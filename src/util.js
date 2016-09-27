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



// Export utilities
module.exports.showNotFound = showNotFound;
module.exports.log = log;
