const fs = require("fs");
const mysql = require("mysql");

class DBConnection {

    constructor(connInfo) {
        this.connInfo = connInfo;
        checkCreds(this);
    }

    /**
     * Performs a query.
     * @param {string} query
     * @param {any[]} args
     * @param {Function} cb 
     */
    query(query, args, cb) {
        checkCreds(this, () => {
            let conn = mysql.createConnection(this.connInfo);
            conn.connect();
            conn.query(mysql.format(query, args), (err, res) => {
                conn.end();
                cb(err, res);
            });
        });
    }
}

function checkCreds(instance, cb = () => {}) {
    if (!instance.connInfo) {
        fs.readFile("credentials/db-creds.json", "utf8", (err, res) => {
            if (err) {
                throw err;
            }
            instance.connInfo = JSON.parse(res);
            cb();
        });
    } else {
        cb();
    }
}

module.exports = DBConnection;