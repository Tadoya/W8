const goSql = require("../basic/goSql");
const resSet = require("../basic/resSet");
module.exports = function(user_key, res){
  const sql = 'UPDATE users '+
              "SET activation = 0 "+
              'WHERE user_key= "'+user_key+'"';
  goSql(sql, res, function(data, fields) {
      resSet.sendStringfyMessage({success: true}, res);
      console.log(user_key+"비활성화");
  });
};