const goSql = require("../basic/goSql");

module.exports = function(message){
  const sql =  'UPDATE users '+
               'SET activation = 0 ' +
               'WHERE user_key = "' + message.getUserId() +'"';
  goSql(sql, function(rows, fields){
    console.log('line_unfollow', message.getUserId());
  });
};