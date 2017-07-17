var mysql = require('mysql');
module.exports = function () {
    var pool = mysql.createPool({
        host: /*mysql_port*/,
        user: /*user_id*/,
        password: /*password*/,
        database: /*DB name*/,
        connectionLimit: 20,
        waitForConnections: true
    });
    
    return pool;
};
