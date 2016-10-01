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

// Get auth methods


// Controllers
var indexController = require("./controllers/indexController.js");
var urlController = require("./controllers/urlController.js");


// Setup auth
passport.use(new Strategy(
  function(id, password, cb) {
    storage.findUserById(id).then(function(user) {
      if (!user) { return cb(null, false); }
      if (user.password != password) { return cb(null, false); }
      return cb(null, user);
    });
  }));

  passport.serializeUser(function(user, cb) {
    cb(null, user.id);
  });

  passport.deserializeUser(function(id, cb) {
    storage.findUserById(id).then(function (err, user) {
      if (err) { return cb(err); }
      cb(null, user);
    });
  });


// Express config
// Use body parser
app.use(bodyParser.urlencoded({extended: true}));
// Store static files in /assets
app.use(express.static(__dirname + '/assets'));


// GET '/'
app.get('/', indexController);


// GET '/:id'
app.get('/:id', urlController);


// Get '/:id/api'
app.get('/:id/api', urlController.api);


// GET '/:id/stats' and send stats
app.get('/:id/stats', urlController.stats);


// API Routes

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
    if(validurl.validate(apiLongUrl)) {
      // Add URL to storage then send response
      storage.addURL(apiLongUrl).then(sendApiResponse);
      // Log it
      util.log("[SNIP] User submitted URL to be Snipped via API", "green");
    } else {
      // Send error
      res.send(JSON.stringify(api.formatAPIError("EINVALIDURL", "The requested URL is invalid")));
      // Log it
      util.log("[SNIP] ERR: Sending EINVALIDURL error via API", "yellow");
    }

    // Send Me Notification mail
    // mail.sendUserShortenedLinkMailToAdmin();

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
