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
     * @param {any} args
     * @param {(err: IError, results?: any, fields?: IFieldInfo) => void} cb 
     */
    query(query, args, cb) {
        checkCreds(this, () => {
            let conn = mysql.createConnection(this.connInfo);
            conn.connect();
            conn.query(mysql.format(query, args), (err, res) => {
                conn.end();
                cb(err, parseObject(res));
            });
        });
    }
}

/**
 * Results coming back from the mysql module don't decode nested json, so do that here.
 * @param {any} data The data to parse, which may or may not be json.
 */
function parseObject(data) {
    if (Array.isArray(data)) {
        for (let i = 0; i < data.length; i++) {
            data[i] = parseObject(data[i]);
        }
    } else if (typeof(data) === "object") {
        for (let key in data) {
            try {
                data[key] = JSON.parse(data[key]);
            } catch (_) { // This is janky.
                continue;
            }
        }
    }
    return data;
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