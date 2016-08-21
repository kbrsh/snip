var http = require('http');
var util = require("../src/util.js");
var data;

var options = {
  host: 'snipit.ga',
  path: '/api/links'
};

http.get(options, function(res) {
  res.on("data", function(chunk) {
    data = chunk;
  });
}).on('error', function(e) {
  util.log("Got error: " + e.message, "red");
});

module.exports.data = data;
