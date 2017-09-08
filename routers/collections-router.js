const debug = require("debug")("server/collections");
const express = require("express");
const DBConnection = require("../data/db-conn");
const send = require("./static-router");
const scryfall = require("scryfall");

const router = express.Router();
const conn = new DBConnection();

router.get("/", (req, resp) => {
    conn.query(`select c.id, c.name, count(cc.card_id) as size from collections c 
        left join collection_card cc on cc.collection_id = c.id 
        where c.user_id = ? group by c.id order by c.name`, {user_id: 1}, (err, data) => {
        if (err) {
            debug("Unable to fetch collections for user", req.session);
        }
        send(resp, data);
    });
});

router.get("/:collectionId", (req, resp) => {
    scryfall.allSets((setData) => {
        send(resp, {
            collectionId: req.params.collectionId,
            setData: setData
        });
    });
});

router.get("/:collectionId/:setCode", (req, resp) => {
    scryfall.fromSet(req.params.setCode, (cardData) => {
        send(resp, {
            collectionId: req.params.collectionId,
            cardData: cardData
        });
    });
});

module.exports = router;