const debug = require("debug")("server/api");
const express = require("express");
const scryfall = require("scryfall");
const send = require("./static-router");
const DBConnection = require("../data/db-conn");

const router = express.Router();
const conn = new DBConnection();

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
        scryfall.getCard(req.params.set, req.params.code, (err, card) => {
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

router.get("/autocomplete", (req, resp) => {
    let name = "%" + (req.query.name || "") + "%";
    conn.query(`select name, mana_cost, type_line from scryfall_cards 
        where layout not in ('token', 'emblem') and name like ? group by name;`, [name], (err, data) => {
        if (err) {
            debug(`Could not fetch info for ${name}.`);
            debug(err);
        } else {
            resp.json(data);
        }
    });
});

module.exports = router;