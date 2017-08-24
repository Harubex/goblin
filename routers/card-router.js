const fs = require("fs");
const path = require("path");
const debug = require("debug")("server/api");
const express = require("express");
const scryfall = require("scryfall");

const htmlPath = path.join(__dirname, "..", "src", "index.html");
const router = express.Router();

let cache = [];

router.get("/:set/:code", (req, resp) => {
    // Check if card data is cached.
    if (cache[req.params.set] && cache[req.params.set][req.params.code]) {
        sendResp(resp, cache[req.params.set][req.params.code]);
    } else {
        // Fetch data if not cached.
        scryfall.getCard(req.params.set, parseInt(req.params.code), (err, card) => {
            if (err) {
                resp.status(404).send(err.message);
            } else {
                if (!cache[req.params.set]) {
                    cache[req.params.set] = [];
                }
                cache[req.params.set][req.params.code] = card;
                sendResp(resp, card);
            }
        });
    }
});

function sendResp(resp, cardData) {
    fs.readFile(htmlPath, "utf8", (err, fileData) => {
        if (err) {
            debug("Unable to fetch html.");
            resp.status(500).send(err.message);
        } else if (cardData == null) {
            resp.status(404).send("Could not fetch card data.");
        } else {
            resp.send(fileData.replace("{state}", JSON.stringify(cardData)));
        }
    });
}

module.exports = router;