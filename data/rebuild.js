const fs = require("fs");
const DBConnection = require("../data/db-conn");
const scryfall = require("scryfall");
const mysql = require("mysql");
const conn = new DBConnection();

let query;

module.exports = function() {
    conn.query("truncate scryfall_cards;", {}, () => {
        fs.readFile("./data/scryfall_insert.sql", "utf8", (err, data) => {
            if (err) {
                throw err;
            }
            query = data;
            buildFromScryfall(1, (cards) => {
                conn.query("truncate cards; insert into cards (scryfall_id) select id from scryfall_cards;", {}, () => {
                    console.log(cards.length + " cards processed.");
                });
            });
        });
    });
}

function buildFromScryfall(page, cb, _data = []) {
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
                buildFromScryfall(page + 1, cb, _data);
            });
        } else {
            cb(_data);
        }
    });
}