const fs = require("fs");
const path = require("path");
const debug = require("debug")("server/api");
const express = require("express");
const scryfall = require("scryfall");

const htmlPath = path.join(__dirname, "..", "src", "index.html");

const router = express.Router();

let cache = [];

router.get("/:set/:code", (req, resp) => {
    if (cache[req.params.set] && cache[req.params.set][req.params.code]) {
        fs.readFile(htmlPath, "utf8", (err, data) => {
            resp.send(data.replace("{content}", "").replace("{state}", JSON.stringify(cache[req.params.set][req.params.code])));
        });
    } else {
        scryfall.getCard(req.params.set, parseInt(req.params.code), (err, card) => {
            if (err) {
                resp.status(404).send(err.message);
            } else {
                if (!cache[req.params.set]) {
                    cache[req.params.set] = [];
                }
                cache[req.params.set][req.params.code] = card;
                fs.readFile(htmlPath, "utf8", (err, data) => {
                    resp.send(data.replace("{state}", JSON.stringify(card)));
                });
            }
        });
    }
});

module.exports = router;