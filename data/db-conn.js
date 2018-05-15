const fs = require("fs");
const knex = require("knex")({
    client: "mysql",
    connection: require("../credentials/mysql-creds.json"),
    debug: false
});

module.exports = {
    knex,
    select: knex.select,
    insert: knex.insert
};