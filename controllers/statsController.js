var fs = require('fs');

var statsTemplate = fs.readFileSync("./views/statsTemplate/stats.html", "utf-8");

var render = function(url) {
    return template.replace(/{{url}}/g, url);
}

var render = function(visits) {
    return statsTemplate.replace(/{{visits}}/g, visits);
}

module.exports.render = render;
