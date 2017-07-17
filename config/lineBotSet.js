module.exports = function (LINEBot, server) {
    const bot = LINEBot.create({
      channelID: /*channelID*/,
      channelSecret: /*channelSecret*/,
      channelToken: /*channelToken*/
    }, server);
    
    return bot;
};