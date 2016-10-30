var mongoose = require('mongoose');
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
