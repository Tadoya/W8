const goSql = require("../basic/goSql");

module.exports = function (user_key, eventData, callback) {
    const sql = 'SELECT * '+
                'FROM users '+
                'WHERE user_key = "'+user_key+'"';
    goSql(sql, function(rows, fields){
      if (typeof callback === "function") {
        return callback(rows[0], fields, eventData);
      }
      console.log('getUserStateCallback error', rows);
    });
};