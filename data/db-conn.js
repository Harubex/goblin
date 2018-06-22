const fs = require("fs");
const knex = require("knex")({
    client: "pg",
    connection: require("../credentials/pg-creds.json"),
    debug: false
});

module.exports = {
    knex
};