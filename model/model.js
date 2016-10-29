var mongoose = require('mongoose');

var mongo_url = process.env.OPENSHIFT_MONGODB_DB_URL || "mongodb://localhost/plate"
mongoose.connect('mongodb://localhost:27017/plate');
