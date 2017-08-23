const mysql = require("mysql");

function connection(connInfo) ***REMOVED***
    return ***REMOVED***
        query: (str, args, cb) => ***REMOVED***
            let conn = mysql.createConnection(connInfo);
            conn.connect();
            conn.query(mysql.format(str, args), (err, res) => ***REMOVED***
                conn.end();
                cb(err, res);
            ***REMOVED***);
        ***REMOVED***
    ***REMOVED***
***REMOVED***

module.exports = connection;