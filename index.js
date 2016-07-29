var server = require('diet');
var app = server();

app.listen('http://0.0.0.0:80');

app.get('/', function($) {
   $.end('Hello World!');
});