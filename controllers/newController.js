var fs = require('fs');
var template = fs.readFileSync("./views/newTemplate/new.html", "utf-8");

var render = function(url) {
    return template.replace(/{{url}}/g, url);
}

module.exports.render = render;
