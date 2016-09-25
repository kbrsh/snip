var nodemailer = require('nodemailer');
var util = require("../src/util.js")

var mailOptions = {
 from: 'hey@snipit.ga', // sender address
 to: 'simplecooldude1@gmail.com', // list of receivers
 subject: 'Snip - Shortened URL',
 html: `
 <body>
 <h1 style="color: #1098F7;">Snip</h1>
 <p>A user just shortened a URL on <a href="http://snipit.ga">Snip</a>.</p>
 </body>` // You can choose to send an HTML body instead
};
var transporter = nodemailer.createTransport({
     service: 'Gmail',
     auth: {
         user: 'simplecooldude1@gmail.com', // Your email id
         pass:  process.env.MAILPASS// Your password
     }
 });

var sendUserShortenedLinkMailToAdmin = function() {
  transporter.sendMail(mailOptions, function(error, info) {
    if(error){
      util.log(error, "red");
    } else{
      util.log("Message Send", "green");
    };
  });
}

module.exports.sendUserShortenedLinkMailToAdmin = sendUserShortenedLinkMailToAdmin;
