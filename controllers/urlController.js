var storage = require("../models/storage.js");
var util = require("../src/util.js")
module.exports = function(req, res) {
   //  Get ID from URL
   var id = req.params.id;

   //  Get URL from storage
   storage.getURL(id).then(function(url) {
      if(!url) {
          // If it doesn't exist, send 404
          util.showNotFound(res);
      } else {
          // If found
          // Update stats
          url.increment('visits', {by: 1});
          // Redirect to URL
          res.redirect(url.url);
          //  Log it down
          util.log("[SNIP] User redirected from /" + id, "green");
      }
   });
}
