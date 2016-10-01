var Sequelize = require('sequelize');
var passportLocalSequelize = require('passport-local-sequelize');
var data = require('../data/data.js');
var fs = require('fs');
var crypto = require('crypto');

var sequelize = new Sequelize('database', 'username', 'password', {
  dialect: 'sqlite',

  pool: {
    max: 5,
    min: 0,
    idle: 10000
  },

  logging: false,

  storage: 'database.sqlite'
});


var URL = sequelize.define('URL', {
    id: { type: Sequelize.STRING(7), unique: true, primaryKey: true },
    visits: Sequelize.INTEGER,
    url: Sequelize.TEXT
});

var User = passportLocalSequelize.defineUser(sequelize, {
    email: Sequelize.STRING,
    links: Sequelize.STRING
});

sequelize.sync();

function randomStr() {
    var tempStr = Math.random().toString(36).slice(-7);
    if(tempStr.length !== 7) {
        tempStr = Math.random().toString(36).slice(-7);
    }
    return tempStr;
}

/* generate UNIQUE id */

function gen() {
    var id = randomStr();
    return URL.findById(id).then(result => result ? gen() : id);
}


module.exports.getURL = function(id) {
    return URL.findById(id);
}

module.exports.addURL = (url) => gen().then(id => URL.create({
    id: id,
    visits: 0,
    url: url
}));

module.exports.getAllLinks = function(req) {
    return allLinksToArray(req).then(function(links) {
        return links;
    });
}

module.exports.seedDatabase = function() {
  fs.unlink(__dirname + "/../database.sqlite");
  data.getData(function(data) {
    for(var i = 0; i < data.length; i++) {
      if(data[i].longURL.indexOf("snipit.ga") === -1) {
      URL.create({
        id: data[i].id,
        visits: data[i].stats.visits,
        url: data[i].longURL
      });
      }
    }
  });
}

// var spam = []
// for(var i = 0; i < spam.length; i++) {
//   module.exports.getURL(spam[i]).then(function(url) {
//     url.destroy();
//   });
// }


var allLinksToArray = function(req) {
    var allLinksArray = [];
    return URL.findAll().then(links => {
       for(var i = 0; i < links.length; i++) {
           var tempAPI = {};

           tempAPI.id = links[i].dataValues.id;
           tempAPI.stats = {visits: links[i].dataValues.visits};
           tempAPI.shortURL = req.protocol + '://' + req.hostname + "/" + links[i].dataValues.id;
           tempAPI.longURL = links[i].dataValues.url;
           allLinksArray.push(tempAPI);
       }
       return allLinksArray;
    });

}

// Users


module.exports.createUser = function(user) {
  var salt = crypto.randomBytes(128).toString('base64');
  var key = crypto.pbkdf2Sync(user.password, salt, 100000, 512, 'sha512');
  User.create({
    username: user.username,
    email: user.email,
    salt: salt,
    hash: key,
    links: ""
  });
}

module.exports.createUser({
  username: "kbr",
  password: "123",
  email: "simplecooldude1@gmail.com"
});

module.exports.User = User;
