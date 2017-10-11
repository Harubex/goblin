const csv = require("csv");
const fs = require("fs");
const path = require("path");
const debug = require("debug")("server/import");

const DBConnection = require("./db-conn");
const conn = new DBConnection();

module.exports = (collectionId, files, cb) => {
    for (let i = 0; i < files.length; i++) {
        csv.parse(files[i].buffer.toString(), {columns: true}, (err, importData) => {
            if (err) {
                throw err;
            }
            conn.query(`select c.id as card_id, sc.name, sc.set from cards c left join scryfall_cards sc on sc.id = c.scryfall_id
                where sc.name in (?) and sc.set in (?)`, [reduce(importData, "Name"), reduce(importData, "Set")], 
            (err, cardData) => {
                let insertData = {};
                importData.forEach((card) => {
                    let c = cardData.find((ele) => {
                        return ele.name === card["Name"] && ele.set.toLowerCase() === card["Set"].toLowerCase();
                    });
                    if (!insertData[c["card_id"]]) {
                        insertData[c["card_id"]] = {
                            name: c["name"],
                            normalQty: 0,
                            foilQty: 0
                        };
                    }
                    insertData[c["card_id"]][JSON.parse(card["Foil"].toLowerCase()) ? "foilQty" : "normalQty"] += parseInt(card["Qty"]);
                });
                let query = [];
                for (let id in insertData) {
                    query.push(`(${collectionId}, ${id}, ${insertData[id].normalQty}, ${insertData[id].foilQty})`);
                }
                conn.query(`insert into collection_card (collection_id, card_id, normal_qty, foil_qty) values ${query.join(", ")} 
                on duplicate key update normal_qty = normal_qty + values(normal_qty), foil_qty = foil_qty + values(foil_qty);`, [],
                (err, data) => {
                    if (!err) {
                        cb(`Imported ${files[i].originalname} successfully.`);
                    }
                });
            });


            /*data.forEach((card) => {
                insertData.push(`(${collectionNumber}, `)
            });*/
        });
    }
}

function reduce(arr, index) {
    return arr.reduce((prev, curr) => {
        if (curr[index] && prev.indexOf(curr[index]) < 0) {
            prev.push(curr[index]);
        }
        return prev;
    }, []);
}