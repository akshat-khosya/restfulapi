const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const nodemailer = require("nodemailer");
const { google } = require("googleapis");
const OAuth2 = google.auth.OAuth2;
const PORTS =  process.env.PORT;

const dotenv = require("dotenv");

dotenv.config();

app.use(cors());
app.use(bodyParser.json());
const oauth2Client = new OAuth2(
  process.env["CLIENTID"], //clientid
  process.env["CLIENTSECRET"], //client secret
  process.env["REDIRECTURRL"] //redirect url
);
oauth2Client.setCredentials({
  refresh_token: process.env["REFRESHTOKEN"],
});
const accessToken = oauth2Client.getAccessToken();
const smtpTransport = nodemailer.createTransport({
  service: "gmail",
  auth: {
    type: "OAuth2",
    user: process.env["NODEMAILERUSER"],
    clientId: process.env["CLIENTID"],
    clientSecret: process.env["CLIENTSECRET"],
    refreshToken: process.env["REFRESHTOKEN"],
    accessToken: accessToken,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

function sendMail(name, email, message) {
  
}
app.post("/sendmail", function (req, res) {
  let contact = req.body;
  mailOptions = {
    to: "aavesh@iiitu.ac.in",
    subject: "New Message",
    html:
      "<h1>New Message here</h1><br><p>Name:" +
      contact.name +
      "<br>From: " +
      contact.email +
      "<br>Message:" +
      contact.message +
      "</p>",
  };
  console.log(mailOptions);
  smtpTransport.sendMail(mailOptions, function (error, response) {
    if (error) {
      console.log(error);
      res.json({ sent: false });
    } else {
      console.log("Message sent: ");
      res.json({ sent: true });
      
    }
  });

  
});

app.listen(PORTS, function () {
  console.log("Server is running on Port: " + PORTS);
});
