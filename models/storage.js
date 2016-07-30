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
    url: Sequelize.TEXT
});

sequelize.sync();


function randomStr() {
    return Math.round((Math.pow(36, 7 + 1) - Math.random() * Math.pow(36, 7))).toString(36).slice(1);
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
    url: url
}));
