module.exports = {
    knex: require("knex")({
        client: "pg",
        connection: require("../credentials/pg-creds.json"),
        debug: false
    })
};