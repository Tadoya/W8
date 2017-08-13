const FacebookBot = require('facebook-bot-messenger');
const stateMappingFacebook = require("../functions/facebook/state/stateMapping");

module.exports = function(facebookBot, urls){
    //--------------------------------------------------------//
    //MESSAGE evnet
    facebookBot.on(FacebookBot.Events.MESSAGE, function(senderId, message) {
        stateMappingFacebook.message(senderId, message, urls, facebookBot);
    });
    
    facebookBot.on(FacebookBot.Events.POSTBACK, function(senderId, postback){
        stateMappingFacebook.postback(senderId, postback, urls, facebookBot);
    });
};