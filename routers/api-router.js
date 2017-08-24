const debug = require("debug")("server/api");
const express = require("express");
const DBConnection = require("../data/db-conn");

const router = express.Router();
const conn = new DBConnection();

router.get("/ping", (req, resp) => {
    resp.json(["pong"]);
});

router.get("/card", (req, resp) => {
    dasda("select * from card", {}, resp);
});

router.get("/test", (req, resp) => {
    dasda("select * from scryfall_cards", {}, resp);
});

function dasda(query, args, resp) {
    conn.query(query, args, (err, res) => {
        if (err) {
            debug(err);
            resp.status(500).json({
                error: err.message
            });
        } else {       
            resp.status(200).json(res);
        }
    });
}

module.exports = router;