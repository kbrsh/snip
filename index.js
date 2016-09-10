// Require Express
var express = require("express");
var app = express();

// Use bodyparser to parse form parameters
var bodyParser = require('body-parser');

// Get utilities
var util = require('./src/util.js');

// Get database methods
var storage = require('./models/storage.js');

// Controllers
var newController = require("./controllers/newController.js");
var statsController = require("./controllers/statsController.js");


// Express config
// Use body parser
app.use(bodyParser.urlencoded({extended: true}));
// Store static files in /assets
app.use(express.static(__dirname + '/assets'));


// GET '/'
app.get('/', function(req, res) {
  // Send index.html file
   res.sendFile(__dirname + '/views/index.html');
});


// POST '/new'
app.post('/new', function(req, res) {
    // Get url param from form
    var url = req.body.url;

    // Set Content Type to HTML
    res.set('Content-Type', 'text/html');

    // UTIL function for rendering and showing the user
    // their shortened URL
    var showNew = url => {
        res.send(newController.render(req.hostname + "/" + url.id));
    };

    // Add URL to storage, then show to the user
    storage.addURL(url).then(showNew);

    // Log it down
    util.log("[SNIP] User posted to /new", "green");
});


// GET '/:id'
app.get('/:id', function(req, res) {
  //  Get ID from URL
   var id = req.params.id;

  //  Get URL from storage
   storage.getURL(id).then(function(url) {
      if(!url) {
        // If it doesn't exist, send 404
          util.showNotFound(res);
      } else {
          // If found
          // Update stats
          url.increment('visits', {by: 1});
          // Redirect to URL
          res.redirect(url.url);
          //  Log it down
          util.log("[SNIP] User redirected from /" + id, "green");
      }
   });
});

app.get('/:id/api', function(req, res) {
   var id = req.params.id;
   res.header('Content-Type', 'application/json');
   res.header("Access-Control-Allow-Origin", "*");
   res.header("Access-Control-Allow-Headers", "X-Requested-With");

   storage.getURL(id).then(function(url) {
      if(!url) {
          res.send(JSON.stringify({error: "ENOTFOUND: The requested url is not valid, or is not found"}));
          util.log("[SNIP] ERR: Sending ENOTFOUND error", "yellow");
      } else {
          res.send(JSON.stringify({id: url.id, stats: { visits: url.visits}, snippedURL: req.protocol + '://' + req.hostname + "/" + url.id, longURL: url.url}));
          util.log("[SNIP] Sending API stats for /" + id, "green");
      }
   });
});

app.get('/:id/stats', function(req, res) {
   var id = req.params.id;
   storage.getURL(id).then(function(url) {
      if(!url) {
          util.showNotFound(res);
      } else {
          res.header('Content-Type', 'text/html');
          res.send(statsController.renderStats(url.visits));
          util.log("[SNIP] Sending web stats for /" + id, "green");
      }
   });
});

app.get("/shorten/v1", function(req, res) {
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

app.get("/api/links", function(req, res) {
    res.header('Content-Type', 'application/json');
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    storage.getAllLinks(req).then(function(links) {
      res.end(links);
    });
});


app.listen(process.env.OPENSHIFT_NODEJS_PORT || process.env.PORT || 3000, process.env.OPENSHIFT_NODEJS_IP || "0.0.0.0", function (req, res) {
    if(process.argv.slice(2)[0] === ("seed" || "SEED")) {
      storage.seedDatabase();
    }
    util.log("[SNIP] Listening", "green");
});
