// Require Express
var express = require("express");
var app = express();

// Use bodyparser to parse form parameters
var bodyParser = require('body-parser');

// Get functions to validate url
var validurl = require("./src/validurl.js");

// Get API functions
var api = require("./src/api/api.js")

// Get utilities
var util = require('./src/util.js');

// Get database methods
var storage = require('./models/storage.js');

// Get mail methods
var mail = require("./mail/mail.js");

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


// Get '/:id/api'
app.get('/:id/api', function(req, res) {
   // get id from URL
   var id = req.params.id;

   // Set CORS, and content type to JSON
   res.header('Content-Type', 'application/json');
   res.header("Access-Control-Allow-Origin", "*");
   res.header("Access-Control-Allow-Headers", "X-Requested-With");

   // Get URL from storage
   storage.getURL(id).then(function(url) {
      //  If doesn't exist, send ENOTFOUND in JSON
      if(!url) {
          res.send(JSON.stringify(api.formatAPIError("ENOTFOUND", "The requested URL is not valid, or is not found")));

          // Log it down
          util.log("[SNIP] ERR: Sending ENOTFOUND error", "yellow");
      } else {
          // Found

          // Check to make pretty or not
          if(req.query.pretty === "true") {
            // Send formatted API Data
            res.send(JSON.stringify(api.formatAPILink(url.id, url.visits, req.protocol + "://" + req.hostname + "/" + url.id, url.url), null, 3));
          } else {
            // Send nonformatted API Data
            res.send(JSON.stringify(api.formatAPILink(url.id, url.visits, req.protocol + "://" + req.hostname + "/" + url.id, url.url)));
          }

          // Log it down
          util.log("[SNIP] Sending API stats for /" + id, "green");
      }
   });
});


// GET '/:id/stats' and send stats
app.get('/:id/stats', function(req, res) {
  // Get ID
   var id = req.params.id;

  //  Get URL from storage
   storage.getURL(id).then(function(url) {
      if(!url) {
        // Send 404 if not found
          util.showNotFound(res);
      } else {
        // Send stats.html if found
          res.header('Content-Type', 'text/html');
          res.sendFile(__dirname + "/views/stats/stats.html");

          // Log it
          util.log("[SNIP] Sending web stats for /" + id, "green");
      }
   });
});


// API GET "/shorten/v1"
app.get("/api/shorten/v1", function(req, res) {
    // Get the long URL
    var apiLongUrl = req.query.url;

    // Set Headers to JSON
    res.header('Content-Type', 'application/json');

    // UTIL for sending the response format
    var sendApiResponse = url => {
        res.send(JSON.stringify(api.formatAPILink(url.id, url.visits, req.protocol + "://" + req.hostname + "/" + url.id, url.url)));
    };


    // Check if URL is valid
    if(validurl.validate(apiLongURL)) {
      // Add URL to storage then send response
      storage.addURL(apiLongUrl).then(sendApiResponse);
    } else {

    }

    // Send Me Notification mail
    // mail.sendUserShortenedLinkMailToAdmin();

    // Log it
    util.log("[SNIP] User submitted URL to be Snipped via API", "green");
});


// API GET "/api/links" to display all Links
app.get("/api/links", function(req, res) {
    // Set Headers JSON and CORS
    res.header('Content-Type', 'application/json');
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");

    // Get all links from storage
    storage.getAllLinks(req).then(function(links) {
      // Check if output should be pretty
      if(req.query.pretty === "true") {
        // If pretty, then send formatted JSON
        res.send(JSON.stringify(links, null, 3));
      } else {
        // Send Minified JSON
        res.send(JSON.stringify(links));
      }
    });
});

// API GET "/api/total" to display total links made
app.get("/api/total", function(req, res) {

    // Set Headers JSON and CORS
    res.header('Content-Type', 'application/json');
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");

    // Get all Links
    storage.getAllLinks(req).then(function(links) {
      if(req.query.pretty === "true") {
        // If pretty, send formatted JSON with total links
        res.send(JSON.stringify({total:links.length}, null, 3));
      } else {
        // Send minfied JSON with total links
        res.send(JSON.stringify({total:links.length}));
      }
    });
});


// Listen
app.listen(process.env.OPENSHIFT_NODEJS_PORT || process.env.PORT || 3000, process.env.OPENSHIFT_NODEJS_IP || "127.0.0.1", function (req, res) {
    // Seed database if seed option present
    if(process.argv.slice(2)[0] === ("seed" || "SEED")) {
      storage.seedDatabase();
    }

    // Log it
    util.log("[SNIP] Listening", "green");
});
