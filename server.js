require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');

const app = express();

const port = process.env.PORT || '3000';

// setting up ejs and its view directory
app.set('views', __dirname + '/public/views');
app.set('view engine', 'ejs');

// bodyParser is used to request html body input values
app.use(
  bodyParser.urlencoded({
    extended: false
  })
);

app.use(bodyParser.json());

app.use(express.static(__dirname + '/public'));

// local files directory
app.use('/css', express.static(__dirname + '/public/css/'));
app.use('/js', express.static(__dirname + '/public/js/'));
app.use('/img', express.static(__dirname + '/public/img/'));

// bootstrap directory
app.use(
  '/bootstrap',
  express.static(__dirname + '/node_modules/bootstrap/dist/')
);

// // jquery directory USELESS
// app.use('/jquery', express.static(__dirname + '/node-modules/jquery/dist/'));

// send index.html file on GET method for www.liansangdesign.com
app.get('/', function (req, res) {
  res.sendFile(__dirname + '/public/index.html');
});

// POST method on Submit button for Contact Request
app.post('/', function (req, res) {
  // Console log when POST and display requested body input values
  console.log('POST method is triggered.');
  console.log(req.body);

  // Formatted information for email
  var outputToEmail = `<p>You have a new contact request.</p>
  <h3>Contact details</h3>
  <ul>
    <li>Name: ${req.body.name}</li>
    <li>Company Name: ${req.body.companyName}</li>
    <li>Email: ${req.body.email}</li>
    <li>Phone: ${req.body.phone}</li>
    <li>Contact Reason: ${req.body.reason}</li>
    <li>Specific: ${req.body.specify}</li>
  </ul>
  <h3>Message body</h3>
  <p>${req.body.message}</p>`;

  // Nodemailer with OAuth2 authentication
  let transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    service: 'gmail',
    port: 465,
    secure: true,
    auth: {
      // Used dotenv document to hide sensitive information
      type: 'OAuth2',
      user: process.env.EMAIL,
      clientId: process.env.CLIENTID,
      clientSecret: process.env.CLIENTSECRET,
      refreshToken: process.env.REFRESHTOKEN
    },
    tls: {
      rejectUnauthorized: false
    }
  });

  // Email settings
  let mailOptions = {
    from: 'Lian Sang ' + '<' + process.env.EMAIL + '>', // sender address
    to: 'hello@liansangdesign.com', // list of receivers
    subject: 'Lian Sang Design: New Contact! from ' + req.body.name + '.', // Subject line
    text: 'New Contact!', // plain text body
    html: outputToEmail // html body
  };

  // Notify if email is successfully sent or failed
  transporter.sendMail(mailOptions, (error, info) => {

    var cStatus = '',
      fMessage = '',
      sMessage = '';

    if (error) {
      cStatus = 'Failed';
      fMessage = 'Your contact request has failed.';
      sMessage = 'Sorry, please try again.';

      console.log(error);

      // rendering a failure connection status page
      res.render('contactStatus', {
        connectionStatus: cStatus,
        firstMessage: fMessage,
        secondMessage: sMessage
      });
    } else {
      cStatus = 'Success';
      fMessage = 'Your contact request was successfully sent.';
      sMessage = 'Thank you!';

      console.log('Message sent: %s', info.messageId);
      // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

      // Preview only available when sending through an Ethereal account
      console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

      // rendering a successful connection status page
      res.render('contactStatus', {
        connectionStatus: cStatus,
        firstMessage: fMessage,
        secondMessage: sMessage
      });
    }
  });
});

// Running sever with express
app.listen(port, function () {
  console.log('Server is running.');
});