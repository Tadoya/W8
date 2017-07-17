const goSql = require("../basic/goSql");

module.exports = function (state, user_key, res, callback, setQuery){
  if(setQuery === undefined) setQuery = '';
  else setQuery =', '+setQuery; 
  
  const sql = 'UPDATE users '+
              'SET state= '+state+setQuery+' '+
              'WHERE user_key = "'+user_key+'"';
              
  goSql(sql, res, function(rows, fields){
    if (typeof callback === "function"){
      return callback();
    }
    console.log("setState callback error");
  });
};