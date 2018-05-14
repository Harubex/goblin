const mysql = require("mysql");
const debug = require("debug")("server/import");
const scryfall = require("scryfall");
const { knex } = require("./db-conn");

let allCards;
module.exports.writeCards = async () => {
    allCards = [];
    try {
        for (let i = 1; await getPage(i); i++);
        let columns = allCards.reduce((columns, card) => {
            Object.keys(card).forEach((column) => !columns.has(column) && columns.add(column));
            return columns;
        }, new Set());
        await knex.batchInsert("scryfall.card", allCards.map((card) => {
            for (let key in card) { 
                if (card[key] && typeof (card[key]) === "object") {
                    card[key] = JSON.stringify(card[key]);
                } 
            }
            return card;
        })).then();
        console.log(`Cards imported. ${allCards.length} total cards processed.`);
    } catch (err) {
        debug(err);
    }
};

/**
 * @param {number} page
 * @returns {Promise<boolean>}
 */
async function getPage(page) {
    const cards = await scryfall.getAllCards(page);
    console.log(`Page ${page}: ${cards.length} cards.`);
    if (cards.length > 0) {
        allCards = allCards.concat(cards);
    }
    return !!cards.length;
}

module.exports.writeSets = async () => {
    try {
        const sets = await scryfall.allSets();
        let columns = sets.reduce((columns, set) => {
            Object.keys(set).forEach((column) => !columns.has(column) && columns.add(column));
            return columns;
        }, new Set());
        await knex.batchInsert("scryfall.set", sets.map((set) => {
            columns.forEach((column) => set[column] = set[column] || null);
            return set; // Sort null parent codes before non-null for FK restraint.
        }, sets).sort((a, b) => !b.parent_set_code - !a.parent_set_code)).then();
    } catch (err) {
        debug(err);
    }
}
