const debug = require("debug")("server/api");
const express = require("express");
const scryfall = require("scryfall");
const send = require("./static-router");

const router = express.Router();

let cache = [];

router.get("/:set/:code", (req, resp) => {
    // Check if card data is cached.
    if (cache[req.params.set] && cache[req.params.set][req.params.code]) {
        send(resp, {
            from: req.query.from,
            card: cache[req.params.set][req.params.code]
        });
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
                send(resp, {
                    from: req.query.from,
                    card: card
                });
            }
        });
    }
});

module.exports = router;