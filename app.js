'use strict';

/*************Let's Encrypt***************/
// returns an instance of node-letsencrypt with additional helper methods 
var lex = require('letsencrypt-express').create({
  // set to https://acme-v01.api.letsencrypt.org/directory in production 
  //server: 'staging'
  server: 'https://acme-v01.api.letsencrypt.org/directory'
// If you wish to replace the default plugins, you may do so here 
// 
, challenges: { 'http-01': require('le-challenge-fs').create({ webrootPath: './public' }) }
, store: require('le-store-certbot').create({ webrootPath: './public' })
 
// You probably wouldn't need to replace the default sni handler 
// See https://git.daplie.com/Daplie/le-sni-auto if you think you do 
//, sni: require('le-sni-auto').create({}) 
 
, approveDomains: approveDomains
});

// handles acme-challenge and redirects to https 
require('http').createServer(lex.middleware(require('redirect-https')())).listen(80, function () {
  console.log("Listening for ACME http-01 challenges on", this.address());
});
 
 
const express = require("express"); 
const app = express();
 
const LINEBot = require('line-messaging');
const FacebookBot = require('facebook-bot-messenger');
const cron = require('node-cron');
const bodyParser = require("body-parser");

const alarm = require("./functions/alarm");
const variables = require("./functions/kakao/basic/variables");

const routeWeb = require("./routes/routeWeb");
const routeKakao = require("./routes/routeKakao");
const routeLine = require("./routes/routeLine");
const routeFacebook = require("./routes/routeFacebook");

const https = require('https');

const server = https.createServer(lex.httpsOptions, lex.middleware(app));
const lineBot = require('./config/lineBotSet')(LINEBot, server);
const facebookBot = require("./config/facebookBotSet")(FacebookBot, server);


server.listen(443, function () {    console.log('https open, Listening for ACME tls-sni-01 challenges and serve app on', this.address()); });
app.use(express.static('public'));

/*****************************/
const urls = 'https://www.w8.ze.am/';



app.use(express.static('public'));
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));


app.use(lineBot.webhook('/line/w8'));
app.use(facebookBot.webhook('/facebookbot/w8'));
routeLine(lineBot, urls);
routeFacebook(facebookBot, urls);
app.use('/kakao/w8', routeKakao);
app.use('/', routeWeb);

// kakao url set
variables.setUrl(urls);


//schedule
var task = cron.schedule('* * * * *', function() {
    alarm(lineBot, facebookBot);
}, false);
task.start();


function approveDomains(opts, certs, cb) {
  // This is where you check your database and associated 
  // email addresses with domains and agreements and such 
 
 
  // The domains being approved for the first time are listed in opts.domains 
  // Certs being renewed are listed in certs.altnames 
  if (certs) {
    opts.domains = certs.altnames;
  }
  else {
    opts.email = 'Email@email.email';
    opts.agreeTos = true;
  }
 
  // NOTE: you can also change other options such as `challengeType` and `challenge` 
  // opts.challengeType = 'http-01'; 
  // opts.challenge = require('le-challenge-fs').create({}); 
 
  cb(null, { options: opts, certs: certs });
}