const mysql = require("mysql");

function connection(connInfo) {
    return {
        query: (str, args, cb) => {
            let conn = mysql.createConnection(connInfo);
            conn.connect();
            conn.query(mysql.format(str, args), (err, res) => {
                conn.end();
                cb(err, res);
            });
        }
    }
}

module.exports = connection;