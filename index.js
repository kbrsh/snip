var express = require("express");
var app = express();
var bodyParser = require('body-parser');
var util = require('./src/util.js');
var storage = require('./models/storage.js');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + '/assets'));

app.get('/', function(req, res) {
   res.sendFile(__dirname + '/views/index.html') ;
});

app.post('/new', function(req, res) {
    var url = req.body.url;
    
    
});

app.listen(process.env.PORT, function (req, res) {
    util.log("Listening", "green");
});