const pool = require('../../../config/mysql')();
module.exports = function goSql(sql, callback){
    pool.getConnection(function(err, connection) {
        if(err){
            if(connection) connection.release();
            return console.log(err);
        }
        connection.query(sql, function(err, rows, fields) {
            connection.release();
            if (err) {
                        return console.log(err);
                     }
            if (typeof callback === "function") {
                return callback(rows, fields);
            }
            console.log('goSqlCallback error', rows);
        });
    });
};