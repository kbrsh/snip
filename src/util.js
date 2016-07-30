var hexu = require('hexu');
var log = function(log, color) {
    if(color) {
        console.log(hexu[color](log));
    } else {
        console.log(hexu.grey(log));
    }
}