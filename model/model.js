var mongoose = require('mongoose');
var random = require("../src/random.js");
var log = require("../src/log.js");

var Schema = mongoose.Schema;

var mongo_url = process.env.OPENSHIFT_MONGODB_DB_URL || "mongodb://localhost/snip"
mongoose.connect('mongodb://localhost:27017/snip');

var urlSchema = new Schema({
  id: { type: String, required: true, unique: true },
  shortURL: String,
  longURL: String,
  stats: {
    visits: Number
  }
});

var url = mongoose.model('url', urlSchema);


module.exports.addURL = (opts, cb) => {
  var randId = random();
  var newURL = new url({
    id: randId,
    shortURL: opts.baseURL + randId,
    longURL: opts.longURL,
    stats: {
      visits: 0
    }
  });

  newURL.save(function(err) {
    if (err) throw err;
    log("==> 📝 Made URL: " + randId, "green");
  });

  cb(newURL);
}

module.exports.getURL = (id, cb) => {
  
}


module.exports.visitURL = (id, cb) => {
  url.findOne({ id: id }, function(err, url) {
    if (err) throw err;

    url.stats.visits++;

    log("==> 📝 Updated URL Visits: ", "green");

    cb(url);
  });
}
