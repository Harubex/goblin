const debug = require("debug")("server/collections");
const express = require("express");
const { knex } = require("../data/db-conn");
const send = require("./static-router");
const scryfall = require("scryfall");
var multer = require("multer");
const storage = multer.memoryStorage();
var upload = multer({storage});

const router = express.Router();

router.get("/", async (req, resp) => {
    if (!req.session.userid) {
        resp.status(302).redirect("/user/login");
    } else {
        try {
            send(req, resp, "Collections", await knex.select({
                id: "collections.id",
                name: "collections.name",
                size: knex.raw("total_cards(collections.id)"),
                value: knex.raw("collection_value(collections.id)")
            }).from("collections")
                .leftJoin("users", "users.id", "collections.user_id")
            .where("users.id", req.session.userid)
            .orderBy("collection.name"));
        } catch (err) {
            debug(`Unable to fetch collections for user ${req.session.userid}: ${err.message}`);
        }
    }
});


router.get("/:collectionId", async (req, resp) => {
    try {
        const collection = await knex.select({
            number: "sc.collector_number",
            setCode: "sc.set",
            setName: "sc.set_name",
            name: "sc.name",
            normal: "cc.normal",
            foil: "cc.foil"
        }).from("collection_card as cc")
            .leftJoin("scryfall.card as sc", "sc.id", "cc.scryfall_id")
        .where("cc.collection_id", req.params.collectionId)
        .groupBy("sc.set", "sc.collector_number");
        if (collection) {
            const sets = await knex("scryfall.set").orderBy("released_at", "desc");
            debugger
        }
    } catch (err) {
        debug(err);
    }
    
   /* conn.query(`
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
    });*/
});

router.post("/:collection_id", async (req, resp) => {
    try {
        if (!req.body) {
            throw new Error("Invalid body passed to collection.");
        }
        const collectionIds = await authenticatedCollections(req);
        const body = (Array.isArray(req.body) ? req.body : [req.body]).map((card) => {
            if (!card.scryfall_id) {
                throw new Error("One or more collection entries is missing a card id.");
            }
            if (!card.collection_id) {
                throw new Error("One or more collection entries is missing a collection id.");
            }
            if (collectionIds.indexOf(card.collection_id) < 0) {
                throw new Error(`Collection (${card.collection_id}) cannot be changed by user (${req.session.userid}).`);
            }
            return {
                collection_id: card.collection_id,
                scryfall_id: card.scryfall_id,
                normal: card.normal || 0,
                foil: card.foil || 0
            };
        });
        const session = req.session; // check for this at some point.
        const query = knex("collection_card").insert(body).toSQL();
        resp.send(await knex.raw(query.sql + ` on duplicate key update ${
            ["foil", "normal"].map((t) => ` ${t} = greatest(${t} + values(${t}), 0)`).join(", ")
        }`, query.bindings));
    } catch (err) {
        debug(err);
        resp.json({
            error: err.message
        });
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

/**
 * 
 * @param {*} req 
 * @returns {number[]}
 */
async function authenticatedCollections(req) {
    const res = await knex.select("collections.id").from("sessions")
        .leftJoin("collections", "collections.user_id", knex.raw("json_extract(sessions.data, '$.userid')"))
        .where("sessions.session_id", req.sessionID);
    return res.map((ele) => ele.id);
}

module.exports = router;