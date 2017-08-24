const fs = require("fs");
const mysql = require("mysql");

class DBConnection ***REMOVED***

    constructor(connInfo) ***REMOVED***
        this.connInfo = connInfo;
        checkCreds(this);
    ***REMOVED***

    /**
     * Performs a query.
     * @param ***REMOVED***string***REMOVED*** query
     * @param ***REMOVED***any[]***REMOVED*** args
     * @param ***REMOVED***Function***REMOVED*** cb 
     */
    query(query, args, cb) ***REMOVED***
        checkCreds(this, () => ***REMOVED***
            let conn = mysql.createConnection(this.connInfo);
            conn.connect();
            conn.query(mysql.format(query, args), (err, res) => ***REMOVED***
                conn.end();
                cb(err, res);
            ***REMOVED***);
        ***REMOVED***);
    ***REMOVED***
***REMOVED***

function checkCreds(instance, cb = () => ***REMOVED******REMOVED***) ***REMOVED***
    if (!instance.connInfo) ***REMOVED***
        fs.readFile("credentials/db-creds.json", "utf8", (err, res) => ***REMOVED***
            if (err) ***REMOVED***
                throw err;
            ***REMOVED***
            instance.connInfo = JSON.parse(res);
            cb();
        ***REMOVED***);
    ***REMOVED*** else ***REMOVED***
        cb();
    ***REMOVED***
***REMOVED***

module.exports = DBConnection;