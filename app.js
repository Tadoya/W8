const express = require("express");
const LINEBot = require('line-messaging');
const app = express();
const cron = require('node-cron');
const bodyParser = require("body-parser");

const alarm = require("./functions/line/alarm");
const variables = require("./functions/kakao/basic/variables");

const routeWeb = require("./routes/routeWeb");
const routeKakao = require("./routes/routeKakao");
const routreLine = require("./routes/routeLine");

const https = require('https');
const fs = require('fs');
const options = {
  ca: fs.readFileSync('./SSL/www_w8_ze_am.ca-bundle.pem'),
  key: fs.readFileSync('./SSL/www_w8_ze_am.key.pem'),
  cert: fs.readFileSync('./SSL/www_w8_ze_am.crt.pem')
};
const server = https.Server(options, app);
const lineBot = require('./config/lineBotSet')(LINEBot, server);
// const routeLine = require("./routes/routeLine")(server);


server.listen(443, function () {    console.log('https open');  });
app.listen(80, function(){  console.log('http oepn');   });
app.use(express.static('public'));
app.use(function (req, res, next) {
    if (!/https/.test(req.protocol)) {
        res.redirect("https://" + req.headers.host + req.url);
    } else {
        return next();
    }
});

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
routreLine(lineBot, urls);
app.use('/kakao/w8', routeKakao);
app.use('/', routeWeb);

// kakao url set
variables.setUrl(urls);


//schedule
var task = cron.schedule('* * * * *', function() {
    alarm(lineBot);
}, false);
task.start();