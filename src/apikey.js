var crypto = require('crypto');
var key;

crypto.randomBytes(16, function (err, bytes) {
    key = new Buffer((new Date().valueOf()) + (bytes).toString('hex')).toString('base64');
});
