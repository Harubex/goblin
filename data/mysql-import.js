const mysql = require("mysql");
const scryfall = require("scryfall");
const { DBConnection, replace } = require("./db-conn");
const conn = new DBConnection();

let totalCards = 0;
module.exports = async () => {
    //for (let i = 0; await writePage(i); i++);
    console.log(`Cards imported. ${totalCards} total cards processed.`);
};

/**
 * @param {number} page
 * @returns {Promise<boolean>}
 */
async function writePage(page) {
    const cards = await scryfall.getAllCards(page);
    console.log(`Page ${page}: ${cards.length} cards.`);
    if (cards.length > 0) {
        const result = await conn.query(insert("card", "c").setFields({
            
        }))
        console.log(result.insertedCount);
        totalCards += cards.length;
    }
    return !!cards.length;
}

module.exports.writeSets = async function writeSets() {
    const sets = await scryfall.allSets();
    let columns = sets.reduce((columns, set) => {
        Object.keys(set).forEach((column) => {
            if (!columns.has(column)) {
                columns.add(column);
            }
        });
        return columns;
    }, new Set());
    await conn.query(replace("scryfall.set").setFieldsRows(sets.reduce((sets, set) => {
        columns.forEach((column) => {
            if (!set[column]) {
                set[column] = null;
            }
        })
        return sets;
    }, sets).sort((a, b) => {
        return !a.parent_set_code ? -1 : !b.parent_set_code ? 1 : 0;
    })));
}
