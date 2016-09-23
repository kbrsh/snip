var nodemailer = require('nodemailer');
var util = require("../src/util.js")

var mailOptions = {
 from: 'hey@snipit.ga', // sender address
 to: 'simplecooldude1@gmail.com', // list of receivers
 subject: 'Email Example',
 html: '<link href="https://fonts.googleapis.com/css?family=Montserrat" rel="stylesheet"><h1>Hello world ✔</h1>' // You can choose to send an HTML body instead
};
var transporter = nodemailer.createTransport({
     service: 'Gmail',
     auth: {
         user: 'simplecooldude1@gmail.com', // Your email id
         pass: process.env.gmailPass // Your password
     }
 });

 transporter.sendMail(mailOptions, function(error, info){
 if(error){
     util.log(error, "red");
 }else{
     util.log("Message Send", "green");
 };
