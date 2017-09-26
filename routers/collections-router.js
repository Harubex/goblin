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

router.delete("/:collectionId", (req, resp) => {
    conn.query(`
        delete * from collection_card where collection_id = ?;
        delete * from collection where id = ?;
    `, [req.params.collectionId, req.params.collectionId], (err, res) => {
        if (err) {
            debug(err);
        } else {
            send(resp, {
                message: `Collection (${req.params.collectionId}) deleted successfully.`
            });
        }
    });
});

router.get("/:collectionId", (req, resp) => {
    conn.query(`select sc.collector_number, sc.set, sc.set_name, sc.name, cc.normal_qty, cc.foil_qty from collections co 
        left join collection_card cc on cc.collection_id = co.id 
        left join cards ca on ca.id = cc.card_id 
        left join scryfall_cards sc on sc.id = ca.scryfall_id 
        where co.id = ? group by sc.set, sc.collector_number`, [req.params.collectionId], (err, res) => {
        let sets = {};
        for (let i = 0; i < res.length; i++) {
            addCardToSet(sets, res[i]);
        }
        conn.query("select * from scryfall_sets order by released_at desc;", (err, setData) => {
            send(resp, {collectionId: req.params.collectionId, sets: setData});
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

router.post("/add", (req, resp) => {
    let body = req.body || {};
    if (body.collectionName) {

    }
});

function addCardToSet(sets, cardData) {
    if (!sets[cardData.set]) {
        sets[cardData.set] = {
            set_name: cardData.set_name,
            cards: []
        };
    }
    sets[cardData.set].cards.push(cardData);
}

module.exports = router;