const goSql = require("../basic/goSql");

module.exports = function(user_key, bot_type, res, callback){
  const sql = 'INSERT INTO users (user_key, bot_type, state) '+
              "VALUE ('"+user_key+"', '"+bot_type+"', '6') "+
              'ON DUPLICATE KEY UPDATE activation=1, state=6';
  goSql(sql, res, function(data, fields) {
      if (typeof callback === "function") {
        return callback(user_key);
      }
      console.log("insertUserCallback Error");
  });
};