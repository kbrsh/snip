var express = require('express');
var bodyParser = require('body-parser');

var log = require("./src/log.js");
var model = require("./model/model.js");

var app = express();

app.use(express.static('assets'));
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.sendFile(__dirname + "/views/index.html");
});

app.post('/api/new', (req, res) => {
  res.header('Content-Type', 'application/json');
  var newURL = req.body.url;
  model.addURL({
    baseURL: req.protocol + '://' + req.get('host'),
    longURL: newURL
  }, (url) => {
    res.send(JSON.stringify(url));
  });
});

// Listen
app.listen(process.env.OPENSHIFT_NODEJS_PORT || process.env.PORT || 3000, process.env.OPENSHIFT_NODEJS_IP || "127.0.0.1", (req, res) => {
  log("======= ✂️ Snip ✂️ =======", "blue");
});
