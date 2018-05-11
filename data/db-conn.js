const fs = require("fs");
const AWS = require("aws-sdk");
const mysql = require("mysql");
const squel = require("squel").useFlavour("mysql");
const isJSON = require("is-json");

class DBConnection {

    constructor(connInfo) {
        this.connInfo = connInfo;
    }

    escape(value) {
        return mysql.escape(value);
    }

    /**
     * Performs a query.
     * @param {string | squel.BaseBuilder | squel.BaseBuilder[]} query
     * @param {any?} args
     * @return {Promise<Object>}
     */
    async query(query, args = []) {
        // typeof here matches both objects and arrays.
        if (typeof (query) === "object") {
            if (!Array.isArray(query)) {
                query = [query];
            }
            let queries = [];
            let params = [];
            query.forEach((ele) => {
                const statement = ele.toParam();
                queries.push(statement.text);
                params.push(...statement.values);
            });
            query = queries.join("; ");
            args = params;
        }
        await checkCreds(this);
        return new Promise((resolve, reject) => {
            let conn = mysql.createConnection(this.connInfo);
            conn.connect();
            conn.query(mysql.format(query, args), (err, res) => {
                conn.end();
                if (err) {
                    reject(err);
                } else {
                    resolve(parseObject(res));
                }
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
            if (isJSON(data[key], true)) {
                data[key] = JSON.parse(data[key])
            }
        }
    }
    return data;
}

/**
 * 
 * @param {*} instance 
 * @returns {Promise<void>}
 */
function checkCreds(instance, cb = () => {}) {
    return new Promise((resolve, reject) => {
        if (!instance.connInfo) {
            fs.readFile("credentials/db-creds.json", "utf8", (err, res) => {
                if (err) {
                    reject(err);
                }
                instance.connInfo = JSON.parse(res);
                resolve();
            });
        } else {
            resolve();
        }
    });
}

/**
 * @type {squel.CompleteQueryBuilderOptions}
 */
const squelSettings = {
    
}

squel.registerValueHandler(Date, (date) => {
    if (!isNaN(date.getTime())) {
        return "'" + date.toISOString().slice(0, 19).replace("T", " ") + "'";
    } else {
        return "null";
    }
});
module.exports = {
    DBConnection,
    expr: (cond, val) => squel.expr().or(cond, val),
    replace: (table) => squel.replace().into(table),
    select: (table, alias) => squel.select(squelSettings).from(table, alias),
    insert: (table) => squel.insert().into(table),
    update: (table, alias) => squel.update().table(table, alias),
    del: (table, alias) => squel.delete().from(table, alias)
};