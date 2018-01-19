const fs = require("fs");
const DBConnection = require("../data/db-conn");
const scryfall = require("scryfall");
const JSONStream = require("JSONStream");
const mysql = require("mysql");
const request = require("request");
const conn = new DBConnection();

let query, setQuery, cardQuery;

function buildMtgJsonDB() {
    fs.readFile("./data/mtgjson_sets_insert.sql", "utf8", (err, _setQuery) => {
        setQuery = _setQuery;
        fs.readFile("./data/mtgjson_cards_insert.sql", "utf8", (err, _cardQuery) => {
            cardQuery = _cardQuery;
            request({url: "https://mtgjson.com/json/AllSets-x.json"}, (err, resp, body) => {
                let json = JSON.parse(body);
                conn.query("truncate mtgjson_cards; truncate mtgjson_sets;", {}, (err, res) => {
                    buildFromMtgjson(Object.keys(json), 0, json, () => {
                        conn.query(`insert ignore into cards (mtgjson_id, scryfall_id)
                        (select mc.id, sc.id from mtgjson_cards mc 
                        left join scryfall_cards sc on sc.name = mc.name && sc.set = mc.mtgjson_code)
                        on duplicate key update mtgjson_id = mc.id;`, {}, (err, data) => {
                            console.log("mtgjson cards parsed");
                        });
                    });
                })
            });         
        });
    });
}

function buildScryfallDB() {
    conn.query("truncate scryfall_sets;", () => {
        fs.readFile("./data/scryfall_sets_insert.sql", "utf8", (err, setQuery) => {
            if (err) {
                throw err;
            }
            let queryData = [];
            scryfall.allSets((sets) => {
                sets.forEach((set) => {
                    let info = [
                        set.code,
                        set.name,
                        set.uri,
                        set.scryfall_uri,
                        set.released_at,
                        set.set_type,
                        set.card_count,
                        set.icon_svg_uri
                    ];
                    for (let x = 0; x < info.length; x++) {
                        if (info[x] && typeof(info[x]) === "object") {
                            info[x] = mysql.escape(JSON.stringify(info[x]));
                        } else {
                            info[x] = mysql.escape(info[x]);
                        }
                    }  
                    queryData.push(`(${info.join(", ")})`);
                });    
                conn.query(setQuery + queryData.join(", ") + "; show warnings;", (err, data) => {
                    if (err) {
                        throw err;
                    }
                    console.log("sets added");
                });
            });
        });
    });
    conn.query("truncate scryfall_cards;", () => {
        fs.readFile("./data/scryfall_cards_insert.sql", "utf8", (err, data) => {
            if (err) {
                throw err;
            }
            query = data;
            getScryfallCardPage(1, (cards) => {
                conn.query("truncate cards; insert into cards (scryfall_id) select id from scryfall_cards;", {}, () => {
                    console.log(cards.length + " cards processed.");
                });
            });
        });
    });
}

function getScryfallCardPage(page, cb, _data = []) {
    scryfall.getAllCards(page, (cards) => {
        if (Array.isArray(cards) && cards.length > 0) {
            let queryData = [];
            for (let i = 0; i < cards.length; i++) {
                let info = [
                    cards[i].id, "card", cards[i].multiverse_id, cards[i].mtgo_id, cards[i].name,
                    cards[i].uri, cards[i].scryfall_uri, cards[i].highres_image, cards[i].image_uri,
                    cards[i].image_uris, cards[i].cmc, cards[i].type_line, cards[i].card_faces,
                    cards[i].oracle_text, cards[i].mana_cost, cards[i].power, cards[i].toughness,
                    cards[i].loyalty, cards[i].colors, cards[i].color_identity, cards[i].layout,
                    cards[i].all_parts, cards[i].legalities, cards[i].reserved, cards[i].reprint,
                    cards[i].set, cards[i].set_name, cards[i].set_uri, cards[i].scryfall_set_uri,
                    cards[i].collector_number, cards[i].digital, cards[i].rarity, cards[i].flavor_text,
                    cards[i].artist, cards[i].frame, cards[i].border_color, cards[i].timeshifted,
                    cards[i].colorshifted, cards[i].futureshifted, cards[i].story_spotlight_number,
                    cards[i].story_spotlight_uri, cards[i].edhrec_rank, cards[i].full_art,
                    cards[i].usd, cards[i].eur, cards[i].tix, cards[i].related_uris, 
                    cards[i].purchase_uris, cards[i].watermark
                ];
                for (let x = 0; x < info.length; x++) {
                    if (info[x] && typeof(info[x]) === "object") {
                        info[x] = mysql.escape(JSON.stringify(info[x]));
                    } else {
                        info[x] = mysql.escape(info[x]);
                    }
                }
                queryData.push(`(${info.join(", ")})`);
            }
            conn.query(query + queryData.join(", ") + "; show warnings;", {}, (err, data) => {
                if (err) {
                    throw err;
                }
                
                console.log("page " + page);
                console.log(JSON.stringify(data));
                _data = _data.concat(cards);
                getScryfallCardPage(page + 1, cb, _data);
            });
        } else {
            cb(_data);
        }
    });
}

function buildFromMtgjson(setCodes, setIndex, allSetData, cb) {
    if (setIndex >= setCodes.length) {
        cb();
    } else {
        let setData = allSetData[setCodes[setIndex]];
        setData[setCodes[setIndex]];
        let setInfo = [
            setData.code,
            setData.name,
            setData.gathererCode,
            setData.oldCode,
            setData.magicCardsInfoCode,
            setData.releaseDate,
            setData.border,
            setData.type,
            setData.block,
            setData.onlineOnly,
            setData.booster
        ];
        for (let x = 0; x < setInfo.length; x++) {
            if (setInfo[x] && typeof(setInfo[x]) === "object") {
                setInfo[x] = mysql.escape(JSON.stringify(setInfo[x]));
            } else {
                setInfo[x] = mysql.escape(setInfo[x]);
            }
        }
        conn.query(setQuery + `(${setInfo.join(", ")})`, {}, (err, data) => {
            if (!setData.cards) {
                throw new Error("No card exist for set.");
            }
            let queryData = [];
            for (let c = 0; c < setData.cards.length; c++) {
                let card = setData.cards[c];
                let cardInfo = [
                    card.id, setData.code, card.layout, card.name, card.names,
                    card.manaCost, card.cmc, card.colors, card.colorIdentity, card.type,
                    card.supertypes, card.types, card.subtypes, card.rarity, card.text,
                    card.flavor, card.artist, card.number, card.power, card.toughness,
                    card.loyalty, card.multiverseid, card.variations, card.imageName, card.watermark,
                    card.border,  card.timeshifted, card.hand, card.life, card.reserved,
                    card.releaseDate, card.starter, card.rulings, card.foreignNames,
                    card.printings, card.originalText, card.originalType, card.legalities, card.source
                ];
                for (let x = 0; x < cardInfo.length; x++) {
                    if (cardInfo[x] && typeof(cardInfo[x]) === "object") {
                        cardInfo[x] = mysql.escape(JSON.stringify(cardInfo[x]));
                    } else {
                        cardInfo[x] = mysql.escape(cardInfo[x]);
                    }
                }
                queryData.push(`(${cardInfo.join(", ")})`);
            }
            conn.query(cardQuery + queryData.join(", ") + "; show warnings;", {}, (err, data) => {
                if (err) {
                    throw err;
                }
                console.log(JSON.stringify(data));
                buildFromMtgjson(setCodes, setIndex + 1, allSetData, cb);
            });
        });
    }
}

function rebuildTables() {
    fs.readFile("./data/rebuild.sql", "utf8", (err, tableQuery) => {
        fs.readFile("./data/collection_value_function.sql", "utf8", (err, functionQuery) => {
            conn.query(tableQuery, (err, data) => {
                if (err) {
                    throw new Error(`Unable to create tables: ${err.message}.`);
                } else {
                    console.log(functionQuery);
                    conn.query(functionQuery, (err, data) => {
                        if (err) {
                            throw new Error(`Unable to create functions: ${err.message}.`);
                        } else {
                            buildMtgJsonDB();
                            buildScryfallDB();
                        }
                    });
                }
            });
        });
    });
}

rebuildTables();
