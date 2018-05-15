const debug = require("debug")("server/user");
const express = require("express");
const bcrypt = require("bcrypt");
const { DBConnection, select } = require("../data/db-conn");
const send = require("./static-router");
const knex = require("knex")({
    client: "mysql",
    connection: require("../credentials/db-creds.json")
});

const router = express.Router();
const conn = new DBConnection();

router.get("/", async (req, resp) => {
    try {
        let statement = select("scryfall_sets");
        if (req.query.excludeTokens) {
            statement = statement.where("set_type != 'funny'");
        }
        statement = statement.order("released_at", false);
        const data = await conn.query(statement);
        resp.json(data);
    } catch (err) {
        debug("Unable to fetch sets:", err);
    }
});

router.get("/raw/:code", async (req, resp) => {
    try {
        const data = await conn.query("select * from scryfall.set where code = '" + req.params.code + "'");
        resp.json(data);
    } catch (err) {
        resp.status(500).json({error: err});
    }
});

router.get("/knex/:code", async (req, resp) => {
    try {
        resp.json(await knex.select().table("scryfall.set").where("code", req.params.code).then());
    } catch (err) {
        resp.status(500).json({error: err});
    }
});

module.exports = router;