const debug = require("debug")("server/api");
const express = require("express");
const connection = require("../data/db-conn")({
    host: "localhost",
    user: "root",
    password: "iLevel258",
    database: "magical"
});

const router = express.Router();

router.get("/ping", (req, resp) => {
    resp.json(["pong"]);
});

router.get("/card", (req, resp) => {
    connection.query("select * from card", {}, (err, res) => {
        if (err) {
            debug(err);
            resp.status(500).json({
                error: err.message
            });
        } else {       
            resp.status(200).json(res);
        }
    });
});

module.exports = router;