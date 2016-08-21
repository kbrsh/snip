var http = require('http');
var util = require("../src/util.js");
var body = [];


var options = {
  host: 'snipit.ga',
  path: '/api/links'
};

module.exports.getData = function() {
  var data;
  http.get(options, function(res) {
    res.on("data", function(chunk) {
      body.push(chunk);
    }).on('end', function() {
      body = Buffer.concat(body).toString();
      data = JSON.parse(body);
      console.log(data);
    });
  }).on('error', function(e) {
    util.log("Got error: " + e.message, "red");
  });
  return data;
}
