module.exports = function (FacebookBot, server) {
    const bot = FacebookBot.create({
      pageID: 'pageID',
      appID: 'appID',
      appSecret: 'appSecret',
      validationToken: 'validationToken',
      pageToken: 'pageToken'
    }, server);
    
    return bot;
};