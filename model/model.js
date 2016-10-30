var mongoose = require('mongoose');
var random = require("./src/random.js");
var log = require("./src/log.js");

var Schema = mongoose.Schema;

var mongo_url = process.env.OPENSHIFT_MONGODB_DB_URL || "mongodb://localhost/snip"
mongoose.connect('mongodb://localhost:27017/snip');

var url = new Schema({
  id: { type: String, required: true, unique: true },
  shortURL: String,
  longURL: String,
  stats: {
    visits: Number
  }
});


module.exports.addURL = (opts, cb) => {
  var newURL = new url({
    id: random(),
    shortURL: opts.shortURL,
    longURL: opts.longURL,
    stats: {
      visits: opts.visits
    }
  });

  newURL.save(function(err) {
    if (err) throw err;
    log("==> 📝 Made URL: ", "green");
  });
}
