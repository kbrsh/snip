var express = require('express');
var bodyParser = require('body-parser');

var log = require("./src/log.js");
var valid = require("./src/valid.js");
var model = require("./model/model.js");

var app = express();

app.use(express.static('assets'));
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.sendFile(__dirname + "/views/index.html");
});

app.get('/:id', (req, res) => {
  var id = req.params.id;

  model.getURL(id, (url) => {
    res.redirect(url.longURL);
  });
});

app.post('/api/new', (req, res) => {
  res.header('Content-Type', 'application/json');
  var newURL = req.body.url;
  if(valid(newURL)) {
    model.addURL({
      baseURL: req.protocol + '://' + req.get('host'),
      longURL: newURL
    }, (url) => {
      res.send(JSON.stringify(url));
    });
  } else {
    res.send(JSON.stringify({
      error: "EINVALID: The reqested URL is invalid."
    }));
  }
});

// Listen
app.listen(process.env.OPENSHIFT_NODEJS_PORT || process.env.PORT || 3000, process.env.OPENSHIFT_NODEJS_IP || "127.0.0.1", (req, res) => {
  log("======= ✂️ Snip ✂️ =======", "blue");
});
