const pool = require('../../../config/mysql')();
module.exports = function(sql, res, callback){
    pool.getConnection(function(err, connection) {
        if(err){
            if(connection) connection.release();
            console.log(err);
            return res.status(500).json({result: "error", msg: "DBConnection"});
        }
        connection.query(sql, function(err, rows, fields) {
            connection.release();
            if (err) {
                        console.log(err);
                        return res.status(500).json({result: "error", msg: "query"});
                     }
            if (typeof callback === "function") {
                return callback(rows, fields);
            }
            console.log('goSqlCallback error', rows);
        });
    });
};