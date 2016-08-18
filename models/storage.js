var Sequelize = require('sequelize');
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

sequelize.sync();


function randomStr() {
    var tempStr = Math.random().toString(36).slice(-7);
    if(tempStr.length !== 7) {
        tempStr = Math.random().toString(36).slice(-7);
    }
    return tempStr;
}

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

module.exports.getAllLinks = function() {
    var apiLinks = [];
    URL.findAll().then(function(links) {
       for(var i = 0; i < links.length; i++) {
           var tempAPI = {};
           
           tempAPI.id = links[i].dataValues.id;
           apiLinks.push(tempAPI);
       }
    });
    return apiLinks;
}
