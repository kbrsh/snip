var fs = require('fs');

var template = fs.readFileSync("./views/template/template.html", "utf-8");


var render = function(link) {
    return template.replace(/{{link}}/g, link);
}

module.exports.render = render;