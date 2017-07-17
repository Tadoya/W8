const goSql = require("../basic/goSql");

module.exports = function (state, user_key, callback, setQuery) {
    //console.log("setState setQuery", setQuery);
    if(setQuery === undefined) setQuery = '';
    else setQuery =', '+setQuery; 
    const sql = 'UPDATE users '+
                'SET state= '+state+setQuery+' '+
                'WHERE user_key = "'+user_key+'"';
    goSql(sql, function(){
      if (typeof callback === "function") {
          //console.log('setState callback');
          return callback();
      }
    });
};