const fs = require("fs");
const path = require("path");
const debug = require("debug")("server/api");
const express = require("express");
const send = require("./static-router");
const images = require("../data/images");
const {knex} = require("../data/db-conn");

const router = express.Router();

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

router.get("/:set/:collector_number", async (req, resp) => {
    try {
        resp.json(await knex.select().from("scryfall.card").where(req.params));
    } catch (err) {
        resp.json({
            error: err.message
        })
    }
});

router.get("/autocomplete", async (req, resp) => {
    try {
        if (!req.query.name || req.query.name.length < 2) {
            throw new Error("Invalid autocomplete search term.");
        } else {
            resp.json(await knex.select("name", "mana_cost", "type_line")
                .from("scryfall.card")
                .whereNotIn("layout", ["token", "emblem"])
                .andWhere("name", "like", `%${req.query.name}%`)
                .groupBy("name").orderBy("name"));
        }  
    } catch (err) {
        debug(err);
        resp.status(400).json({
            error: err.message
        });
    }
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