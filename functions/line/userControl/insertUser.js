const goSql = require("../basic/goSql");
const setting = require("../setting");

module.exports = function (message, replyToken, lineBot){
  const sql = 'INSERT INTO users (user_key, bot_type, state) '+
              "VALUE ('"+message.getUserId()+"', 'LINE', '2') "+
              'ON DUPLICATE KEY UPDATE activation=1, state=2';
  goSql(sql, function(data, fields) {
      lineBot.replyMessage(replyToken, setting.initWeightTypeButton());
  });
};