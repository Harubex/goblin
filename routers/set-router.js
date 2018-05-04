const debug = require("debug")("server/user");
const express = require("express");
const bcrypt = require("bcrypt");
const squel = require("squel");
const DBConnection = require("../data/db-conn");
const send = require("./static-router");

const router = express.Router();
const conn = new DBConnection();

router.get("/", async (req, resp) => {
    try {
        let statement = squel.select().from("scryfall_sets");
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

module.exports = router;