const debug = require("debug")("server/user");
const express = require("express");
const bcrypt = require("bcrypt");
const DBConnection = require("../data/db-conn");
const send = require("./static-router");

const router = express.Router();
const conn = new DBConnection();

router.get("/", (req, resp) => {
    const filter = req.query.excludeTokens ? " where sc.set_type != 'funny'" : "";
    conn.query("select * from scryfall_sets sc" + filter + " order by sc.released_at desc", (err, data) => {
        if (err) {
            debug("Unable to fetch sets:", err);
        } else {
            resp.json(data);
        }
    });
});

module.exports = router;