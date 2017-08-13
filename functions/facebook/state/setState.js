const goSql = require("../basic/goSql");

module.exports = function (nextState, user_key, callback, setQuery) {
    //console.log("setState setQuery", setQuery);
    if(setQuery === undefined) setQuery = '';
    else setQuery =', '+setQuery; 
    const sql = 'UPDATE users '+
                'SET state= '+nextState+setQuery+' '+
                'WHERE user_key = "'+user_key+'"';
    goSql(sql, function(){
      if (typeof callback === "function") {
          //console.log('setState callback');
          return callback();
      }
    });
};