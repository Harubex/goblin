const csv = require("csv");
const fs = require("fs");
const path = require("path");
const debug = require("debug")("server/import");
const { DBConnection, select, insert, expr } = require("./db-conn");

const conn = new DBConnection();

module.exports = async (collectionId, files, cb) => {
    try {
        for (let i = 0; i < files.length; i++) {
            const importData = await parseCSV(files[i]);
            const cardData = await conn.query(select("cards", "c").left_join("scryfall_cards", "sc", "sc.id = c.scryfall_id").fields({
                "c.id": "card_id",
                "sc.name": "name",
                "sc.set": "set"
            }).where(expr("sc.name in ?", reduce(importData, "Name")).and("sc.set in ?", reduce(importData, "Set"))));
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
            
            const data = await conn.query(insert("collection_card").set({
                collection_id: collectionId,
                card_id: id,
                normal_qty: insertData[id].normalQty,
                foil_qty: insertData[id].foilQty
            })
            .onDupUpdate("normal_qty", "normal_qty + values(normal_qty)")
            .onDupUpdate("foil_qty", "foil_qty + values(foil_qty)"));
            return `Imported ${files[i].originalname} successfully.`;
        }
    } catch (err) {
        debug(err);
    }
}

/**
 * 
 * @returns {Promise<Object>} file 
 */
async function parseCSV(file) {
    return new Promise((resolve, reject) => {
        csv.parse(file.buffer.toString(), {columns: true}, (err, importData) => {
            if (err) {
                reject(err);
            } else {
                resolve(importData);
            }
        });
    });
    
}

function reduce(arr, index) {
    return arr.reduce((prev, curr) => {
        if (curr[index] && prev.indexOf(curr[index]) < 0) {
            prev.push(curr[index]);
        }
        return prev;
    }, []);
}