var express = require("express");
var app = express();
var bodyParser = require('body-parser');
var util = require('./src/util.js');
var storage = require('./models/storage.js');
var view = require('./src/view.js');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + '/assets'));

app.get('/', function(req, res) {
   res.sendFile(__dirname + '/views/index.html') ;
});

app.post('/new', function(req, res) {
    var url = req.body.url;
    res.set('Content-Type', 'text/html');
    
    var showNew = url => {
        res.send(view.render(req.hostname + "/" + url.id));
    };
    
    storage.addURL(url).then(showNew);
    util.log("[SNIP] User posted to /new", "green");
});

app.get('/:id', function(req, res) {
   var id = req.params.id;
   storage.getURL(id).then(function(url) {
      if(!url) {
          res.end('404 Not Found');
          util.log("[SNIP] 404 Not Found", "yellow");
      } else {
          
          res.redirect(url.url);
          util.log("[SNIP] User redirected from /" + id, "green");
      }
   });
});

app.get('/:id/api', function(req, res) {
   var id = req.params.id;
   storage.getURL(id).then(function(url) {
      if(!url) {
          res.end('404 Not Found');
          util.log("[SNIP] 404 Not Found", "yellow");
      } else {
          res.header('Content-Type', 'application/json');
          res.header("Access-Control-Allow-Origin", "*");
          res.header("Access-Control-Allow-Headers", "X-Requested-With");
          res.send(JSON.stringify({id: url.id, stats: { visits: url.visits}, snippedURL: req.protocol + '://' + req.hostname + "/" + url.id, longURL: url.url}));
          util.log("[SNIP] Sending API stats for /" + id, "green");
      }
   });
});

app.get("/shorten/url", function(req, res) {
    var apiLongUrl = req.query.url;
    res.header('Content-Type', 'application/json');
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    
    var sendApiResponse = url => {
        res.send(JSON.stringify({id: url.id, stats: { visits: url.visits}, snippedURL: req.protocol + '://' + req.hostname + "/" + url.id, longURL: url.url}));
    };
    
    storage.addURL(apiLongUrl).then(sendApiResponse);
    util.log("[SNIP] User submitted URL to be Snipped via API", "green");
});


app.listen(process.env.PORT || 3000, function (req, res) {
    util.log("[SNIP] Listening", "green");
});