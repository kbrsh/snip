// Require Express
var express = require("express");
var app = express();

// Express Helpers
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');


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
var passport = require('passport');
var Strategy = require('passport-local').Strategy;

// Controllers
var indexController = require("./controllers/indexController.js");
var urlController = require("./controllers/urlController.js");
var dashboardController = require("./controllers/dashboardController.js");


// Express config
app.use(express.static(__dirname + '/assets'));

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());
app.use(session({ secret: 'keyboard cat', resave: false, saveUninitialized: false }));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new Strategy(
  function(username, password, done) {
    storage.User.find({ username: username })
    .then(function(user) {
      if (!user) {
        return done(null, false, { message: 'Incorrect username or password.' });
      } else {
          if (user.password != password) {
            return done(null, false, { message: 'Incorrect username or password.' });
          }
      }
      return done(null, user);
    });
}));

passport.serializeUser(function(user, done) {
  done(null, user.username);
});

passport.deserializeUser(function(username, done) {
 storage.User.find({ username: username }).then(function(user) {
    done(null, user);
  });
});


// GET '/'
app.get('/', indexController);

// GET '/dashboard'
app.get('/dashboard', require('connect-ensure-login').ensureLoggedIn(), dashboardController);

// POST "/login"
app.post('/auth/login',  passport.authenticate('local', { failureRedirect: '/' }), function(req, res) {
    res.redirect('/');
});


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
