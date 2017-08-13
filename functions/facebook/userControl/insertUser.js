const goSql = require("../basic/goSql");

module.exports = function (senderId, facebookBot){
  var sex ='F';
  var locale = 'ko';
  
  facebookBot.getProfile(senderId).then(function(data) {
      if(data.gender==='male') sex = 'M';
      locale = data.locale.substr(0,2);
      var now = new Date();
      var nowTime = ((now.getUTCHours()+data.timezone)%24)+":"+now.getUTCMinutes();
      console.log(senderId, sex, nowTime,locale);
      const sql = 'INSERT INTO users (user_key, bot_type, state, sex, alarm_time,language) '+
              "VALUE ('"+senderId+"', 'FACEBOOK', '6', '"+sex+"', '"+now.getUTCHours()+":"+now.getUTCMinutes()
              +"', '"+locale+"')"+
              'ON DUPLICATE KEY UPDATE activation=1, state=6';
      goSql(sql, function(data, fields) {
          console.log("facebook_insertUser", senderId);
          facebookBot.sendTextMessage(senderId, "What if you can build a slim and healthy body with a weight scale?\n"+
                                                "W8 will manage and analyze  your weight data systematically!\n"+
                                                "Take your health while measuring your weight periodically with W8!\n"+
                                                "Chart graphs are normally displayed after the 2nd day.");
          facebookBot.sendTextMessage(senderId, 'W8 will send you a "Today\'s weight?" alarm message at '+nowTime
                      + "\nYou can turn off the alarm, if you don't want to.\n(Setting >> Alarm >> OFF)");
      });
  }).catch(function(error) {
      console.error(error);
  });
};