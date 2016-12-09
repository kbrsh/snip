var express = require('express');
var bodyParser = require('body-parser');

var log = require("./src/log.js");
var valid = require("./src/valid.js");
var notFound = require("./src/404.js");
var model = require("./model/model.js");

var app = express();

app.use(express.static('assets'));
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.sendFile(__dirname + "/views/index.html");
});

app.get("/random", (req, res) => {
  res.sendFile(__dirname + "/views/random.html");
});

app.post('/api/new', (req, res) => {
  res.header('Content-Type', 'application/json');
  var newURL = req.body.url;
  if(valid(newURL)) {
    model.addURL({
      baseURL: req.protocol + '://' + req.get('host'),
      longURL: newURL
    }, (url) => {
      res.send(JSON.stringify({
        id: url.id,
        shortURL: url.shortURL,
        longURL: url.longURL,
        stats: {
          visits: url.stats.visits
        },
        createdAt: url.createdAt
      }));
    });
  } else {
    res.send(JSON.stringify({
      error: "EINVALID: The reqested URL is invalid."
    }));
  }
});


app.get('/:id', (req, res) => {
  var id = req.params.id;
  model.getURL(id, (url) => {
    if(url) {
      model.visitURL(id);
      res.redirect(url.longURL);
    } else {
      notFound(req, res);
    }
  });
});

app.get('/:id/api', (req, res) => {
  var id = req.params.id;
  res.header('Content-Type', 'application/json');

  model.getURL(id, (url) => {
    if(url) {
      res.send(JSON.stringify({
        id: url.id,
        shortURL: url.shortURL,
        longURL: url.longURL,
        stats: {
          visits: url.stats.visits
        },
        createdAt: url.createdAt
      }));

      log("==> 📈 Getting URL API For: " + id, "green");
    } else {
      res.send(JSON.stringify({
        error: "ENOTFOUND: The reqested URL could not be found."
      }));
    }
  });
});

app.get('/:id/stats', (req, res) => {
  res.sendFile(__dirname + "/views/stats.html");
  log("==> 📈 Getting URL Stats", "green");
});

app.get("/api/links", (req, res) => {
  res.header('Content-Type', 'application/json');
  model.getAll((links) => res.send(JSON.stringify(links)));
});

app.get('*', function(req, res){
  res.status(404).send('404 Not Found');
});

// Listen
app.listen(process.env.OPENSHIFT_NODEJS_PORT || process.env.PORT || 3000, process.env.OPENSHIFT_NODEJS_IP || "127.0.0.1", (req, res) => {
  log("======= ✂️ Snip ✂️ =======", "blue");
});
