const fs = require("fs");
const AWS = require("aws-sdk");
const isJSON = require("is-json");
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