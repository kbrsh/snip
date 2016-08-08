var fs = require('fs');

var template = fs.readFileSync("./views/template/template.html", "utf-8");
var statsTemplate = fs.readFileSync("./views/statsTemplate/stats.html", "utf-8");

var render = function(url) {
    return template.replace(/{{url}}/g, url);
}

var renderStats = function(visits) {
    return statsTemplate.replace(/{{visits}}/g, visits);
}

module.exports.render = render;
module.exports.renderStats = renderStats;