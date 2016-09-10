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

module.exports.showNotFound = showNotFound;
module.exports.log = log;
