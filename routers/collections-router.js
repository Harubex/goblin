const debug = require("debug")("server/collections");
const express = require("express");
const { DBConnection, del, select } = require("../data/db-conn");
const importFiles = require("../data/import");
const send = require("./static-router");
const scryfall = require("scryfall");
var multer = require("multer");
const storage = multer.memoryStorage();
var upload = multer({storage});

const router = express.Router();
const conn = new DBConnection();

router.get("/", async (req, resp) => {
    try {
        const data = await conn.query(select("collections", "co").left_join("collection_card", "cc", "cc.collection_id = co.id").fields({
            "co.id": "id",
            "co.name": "name",
            "count(cc.card_id)": "size",
            "collection_value(co.id)": "total_value"
        }).where("co.user_id = ?", req.session.userid).group("co.id").order("co.name", true));
        data.forEach((co) => {
            co.total_value = co.total_value || 0;
        });
        send(req, resp, data);
    } catch (err) {
        debug(`Unable to fetch collections for user ${req.session.userid}: ${err.message}`);
    }
});

router.get("/import", (req, resp) => {
    conn.query(`select c.id, c.name, count(cc.card_id) as size from collections c 
        left join collection_card cc on cc.collection_id = c.id 
        where c.user_id = ? group by c.id order by c.name`, [req.session.userid], (err, data) => {
        if (err) {
            debug("Unable to fetch collections for user", req.session);
        }
        send(req, resp, {
            collections: data
        });
    });
});

router.post("/import", upload.any(), (req, resp) => {
    importFiles(req.body.collection, req.files, (msg) => {
        conn.query(`select c.id, c.name, count(cc.card_id) as size from collections c 
            left join collection_card cc on cc.collection_id = c.id 
            where c.user_id = ? group by c.id order by c.name`, [req.session.userid], (err, data) => {
            if (err) {
                debug("Unable to fetch collections for user", req.session);
            }      
            send(req, resp, {
                message: msg,
                collections: data
            });
        });
    });
});

router.delete("/:collectionId", (req, resp) => {
    try {
        /*await conn.query([
            del("collection_card").where("collection_id = ?", req.params.collectionId),
            del("collections").where("id = ?", req.params.collectionId)
        ]);
        resp.json({
            message: `Collection (${req.params.collectionId}) deleted successfully.`
        });*/
    } catch (err) {
        debug(err);
    }
});

router.delete("/:collectionId/cards", (req, resp) => {
    conn.query(`
        delete from collection_card where collection_id = ?;
    `, [req.params.collectionId], (err, res) => {
        if (err) {
            debug(err);
        } else {
            resp.json({
                message: `Cards from collection (${req.params.collectionId}) deleted successfully.`
            });
        }
    });
});

router.get("/:collectionId", (req, resp) => {
    conn.query(`
        select sc.collector_number, sc.set, sc.set_name, sc.name, cc.normal_qty, cc.foil_qty from collections co 
            left join collection_card cc on cc.collection_id = co.id 
            left join cards ca on ca.id = cc.card_id 
            left join scryfall_cards sc on sc.id = ca.scryfall_id 
            where co.id = ? group by sc.set, sc.collector_number
    `, [req.params.collectionId], (err, res) => {
        let ownedCards = {};
        for (let i = 0; i < res.length; i++) {
            addCardToSet(ownedCards, res[i]);
        }
        conn.query("select * from scryfall_sets order by released_at desc;", (err, setData) => {
            send(req, resp, {
                collectionId: req.params.collectionId,
                ownedCards: ownedCards, 
                sets: setData.map((set) => {
                    set.visible = true;
                    return set;
                })
            });
        });
    });
});

router.get("/:collectionId/:setCode", (req, resp) => {
    conn.query(`
        select sc.collector_number, sc.card_faces, sc.usd, ifnull(cc.normal_qty, 0) as normal_qty, 
            ifnull(cc.foil_qty, 0) as foil_qty, sc.name, sc.image_uris, sc.set 
            from magical.scryfall_cards sc left join cards c on c.scryfall_id = sc.id left join collection_card cc on cc.card_id = c.id
            where sc.\`set\` = ? order by ifnull(nullif(cast(sc.collector_number as signed), 0), 1e50);
    `, [req.params.setCode], (err, data) => {
        if (err) {
            debug(err);
        } else {
            send(req, resp, {
                collectionId: req.params.collectionId,
                cardData: data
            });
        }
    });
});

router.post("/add", (req, resp) => {
    let body = req.body || {};
    if (body.collectionName) {
        conn.query(`
            select * from collections where user_id = ? and name = ?;
        `, [req.session.userid, body.collectionName], (err, data) => {
            if (err) {
                debug(err);
            } else if (data.length > 0) {
                resp.status(409).json({ message: "A collection with this name already exists."});
            } else {
                conn.query(`
                    insert into collections (user_id, name) values (?, ?);
                    select * from collections where user_id = ? and name = ?;
                `, [req.session.userid, body.collectionName, req.session.userid, body.collectionName], (err, data) => {
                    if (err) {
                        debug(err);
                    } else {
                        resp.json({
                            message: `Collection (${body.collectionName}) added successfully.`,
                            data: data[1][0]
                        });
                    }
                });
            }
        });
    } else {
        resp.status(400).json({ message: "Please provide a name."});
    }
});

router.post("/:collectionId/add", (req, resp) => {
    let body = req.body || {};
    conn.query(`insert into collection_card (collection_id, card_id, normal_qty, foil_qty)  
        (select ?, c.id, ?, ? from cards c left join scryfall_cards sc on sc.id = c.scryfall_id where sc.id = ?) on duplicate key update 
        normal_qty = normal_qty + ?, foil_qty = foil_qty + ?;`, 
        [req.params.collectionId, body.normalQty, body.foilQty, body.cardId, body.normalQty, body.foilQty], 
    (err, data) => {
        if (err) {
            debug(err);
        } else {
            resp.json({
                msg: ""
            });
        }
    });
});

function addCardToSet(sets, cardData) {
    if (cardData.set) { // Don't add null values.
        if (!sets[cardData.set]) {
            sets[cardData.set] = {
                set_name: cardData.set_name,
                cards: []
            };
        }
        sets[cardData.set].cards.push(cardData);
    }
}

module.exports = router;