var storage = require("../models/storage.js");
var util = require("../src/util.js");
var api = require("../src/api/api.js")
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

// Get info of a URL
module.exports.api = function(req, res) {
   // get id from URL
   var id = req.params.id;

   // Set CORS, and content type to JSON
   res.header('Content-Type', 'application/json');
   res.header("Access-Control-Allow-Origin", "*");
   res.header("Access-Control-Allow-Headers", "X-Requested-With");

   // Get URL from storage
   storage.getURL(id).then(function(url) {
      //  If doesn't exist, send ENOTFOUND in JSON
      if(!url) {
          res.send(JSON.stringify(api.formatAPIError("ENOTFOUND", "The requested URL is not valid, or is not found")));
          // Log it down
          util.log("[SNIP] ERR: Sending ENOTFOUND error", "yellow");
      } else {
          // Found
          // Check to make pretty or not
          if(req.query.pretty === "true") {
            // Send formatted API Data
            res.send(JSON.stringify(api.formatAPILink(url.id, url.visits, req.protocol + "://" + req.hostname + "/" + url.id, url.url), null, 3));
          } else {
            // Send nonformatted API Data
            res.send(JSON.stringify(api.formatAPILink(url.id, url.visits, req.protocol + "://" + req.hostname + "/" + url.id, url.url)));
          }

          // Log it down
          util.log("[SNIP] Sending API stats for /" + id, "green");
      }
   });
}
