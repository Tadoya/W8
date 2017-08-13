const LINEBot = require('line-messaging');
const stateMappingLine = require("../functions/line/state/stateMapping");
const insertUserLine = require("../functions/line/userControl/insertUser");
const blockUserLine = require("../functions/line/userControl/blockUser");

module.exports = function(lineBot, urls){
    //--------------------------------------------------------//
    //MESSAGE evnet
    lineBot.on(LINEBot.Events.MESSAGE, function(replyToken, message) {
        stateMappingLine.message(replyToken, message, urls, lineBot);
    });
    
    //postback event
    lineBot.on(LINEBot.Events.POSTBACK, function(replyToken, postback){
        stateMappingLine.postback(replyToken, postback, urls, lineBot);
    });
    
    //FOLLOW event
    lineBot.on(LINEBot.Events.FOLLOW, function(replyToken, message) {
        if(message.isUserEvent() === true){ //그룹이나, 룸에선 이용불가
            return insertUserLine(message, replyToken, lineBot);
        }
        console.log("FOLLOW ERROR");
    });
    
    //JOIN Event
    lineBot.on(LINEBot.Events.JOIN, function(replyToken, message) {
        console.log('join', message);
        //bot.replyMessage(replyToken, helloConfirm_template);
    });
    
    //BLOCK Evnet
    lineBot.on(LINEBot.Events.UNFOLLOW, function(replyToken, message) {
       blockUserLine(message);
    });
};