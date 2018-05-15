const fs = require("fs");
const path = require("path");
const debug = require("debug")("server/api");
const express = require("express");
const scryfall = require("scryfall")
const send = require("./static-router");
const { DBConnection } = require("../data/db-conn");
const images = require("../data/images");

const router = express.Router();
const conn = new DBConnection();

let cache = [];

router.get("/images/:set/:code", (req, resp) => {
    const staticPath = path.join(__dirname, `../static/cards/${req.params.set}/${req.params.code}`);
    let exists = fs.existsSync(staticPath + ".png");
    if (!exists) {
        exists = fs.existsSync(staticPath + ".jpg");
        if (!exists) {
            scryfall.getCard(req.params.set, req.params.code, (err, card) => {
                if (err) {
                    debug(err);
                    resp.sendFile(path.join(__dirname, "../static/cardback.png"));
                } else {                    
                    images.saveImage(card, (card.image_uris || card.card_faces[0].image_uris).png, card.set, card.collector_number, () => {
                        resp.sendFile(staticPath + ".png");
                    });
                }
            });
        } else {
            resp.sendFile(staticPath + ".jpg");
        }
    } else {
        resp.sendFile(staticPath + ".png");
    }
});

router.get("/:set/:code", (req, resp) => {
    // Check if card data is cached.
    if (cache[req.params.set] && cache[req.params.set][req.params.code]) {
        send(req, resp, {
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
                send(req, resp, {
                    from: req.query.from,
                    card: card
                });
            }
        });
    }
});

router.get("/autocomplete", (req, resp) => {
    let name = "%" + (req.query.name || "") + "%";
    conn.query(`select name, mana_cost, type_line, card_faces from scryfall_cards 
        where layout not in ('token', 'emblem') and name like ? group by name;`, [name], (err, data) => {
        if (err) {
            debug(`Could not fetch info for ${name}.`);
            debug(err);
        } else {
            resp.json(data);
        }
    });
});

router.get("/sets", (req, resp) => {
    let name = req.query.name;
    if (!name) {
        resp.json([]);
    } else {
        conn.query(`select sc.id, sc.\`set\` as code, sc.rarity, sc.set_name from scryfall_cards sc 
            left join scryfall_sets ss on ss.code = sc.set where sc.name = ? order by ss.released_at desc;`, [name], (err, data) => {
                if (err) {
                debug(`Could not fetch info for ${name}.`);
                debug(err);
            } else {
                resp.json(data);
            }
        });
    }
})

module.exports = router;