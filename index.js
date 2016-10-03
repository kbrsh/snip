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
var userController = require("./controllers/userController.js");


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
    storage.getUser(username)
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
 storage.getUser(username).then(function(user) {
    done(null, user);
  });
});


// GET '/'
app.get('/', indexController);

// GET '/dashboard'
app.get('/dashboard', require('connect-ensure-login').ensureLoggedIn("/?error=Whoops!spaceYouspacearespacenotspaceloggedspacein!"), dashboardController);

// POST "/auth/login"
app.post('/auth/login',  passport.authenticate('local', { failureRedirect: '/?error=Whoops!spaceUsernamespaceorspacepasswordspaceisspaceincorrect.' }), function(req, res) {
    res.redirect('/');
});

// POST "/auth/signup"
app.post('/auth/signup', function(req, res) {
  if(/^[a-zA-Z0-9_]+$/.test(req.body.username) && /^[-a-z0-9~!$%^&*_=+}{\'?]+(\.[-a-z0-9~!$%^&*_=+}{\'?]+)*@([a-z0-9_][-a-z0-9_]*(\.[-a-z0-9_]+)*\.(aero|arpa|biz|com|coop|edu|gov|info|int|mil|museum|name|net|org|pro|travel|mobi|[a-z][a-z])|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,5})?$/i
.test(req.body.email)) {
    storage.createUser({
      username: req.body.username,
      password: req.body.password,
      email: req.body.email
    }, function() {
      res.redirect("/?success=Nice!spaceNowspacelogspacein!")
    });
  } else {
    res.redirect("/?error=Whoops!spaceThespaceenteredspaceinformationspaceisspaceinvalid!")
  }
});

app.get('/logout', function(req, res){
    req.logout();
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

        // Check if made by user, if so, add to their url's
        if(req.user) {
            storage.getUser(req.user.username).then(function(user) {
              var links = user.links.split("#");
              links.push(url.id);
              user.updateAttributes({
                links: links.join("#")
              });
            });
        }
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

// API GET "/api/user" to get user's info
app.get('/api/user', userController);

// Listen
app.listen(process.env.OPENSHIFT_NODEJS_PORT || process.env.PORT || 3000, process.env.OPENSHIFT_NODEJS_IP || "127.0.0.1", function (req, res) {
    // Seed database if seed option present
    if(process.argv.slice(2)[0] === ("seed" || "SEED")) {
      storage.seedDatabase();
    }

    // Log it
    util.log("[SNIP] Listening", "green");
});
