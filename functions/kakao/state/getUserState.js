const goSql = require("../basic/goSql");
module.exports = function(user_key, res, req, callback) {
    const sql = 'SELECT * '+
                'FROM users '+
                'WHERE user_key = "'+user_key+'"';
    goSql(sql, res, function(rows, fields) {
      if(typeof callback === "function") {
        return callback(rows[0], fields, req.body.content);
      }
      console.log('getUserStateCallback error', rows);
    });
};