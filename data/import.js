const scryfall = require("scryfall");
const { knex } = require("./db-conn");
const ScryfallSet = require("./tabledefs/scryfall.set");
const ScryfallCard = require("./tabledefs/scryfall.card");
const ScryfallRuling = require("./tabledefs/scryfall.ruling");
const debug = require("debug");
debug.disable("knex:bindings"); // Avoid log spam during import.

/**
 * @type {ScryfallCard[]}
 */
const cards = [];

/**
 * Pages through all available cards and writes them to the DB.
 * @param {number?} page The page number to start on.
 */
async function writeCards(page = 1) {
    try {
        let totalCards = 0;
        let totalTime = 0;
        let lastPageTime = new Date();
        console.log(`Started card import at ${lastPageTime.toString()}`);
        for (let pageCards; pageCards = await scryfall.getAllCards(page); page++, totalCards += pageCards.length) {
            console.log(`Cards in page: ${pageCards.length}`);
            if (!pageCards.length) {
                break;
            }
            await knex.batchInsert("scryfall.card", pageCards.map((card) => {
                cards.push(card);
                for (let key in card) {
                    if (card[key] && typeof (card[key]) === "object") {
                        card[key] = JSON.stringify(card[key]);
                    }
                }
                if (card.mana_cost === "") {
                    card.mana_cost = null;
                }
                return card;
            })).then();
            let thisPageTime = new Date();
            let delta = thisPageTime - lastPageTime;
            totalTime += delta;
            lastPageTime = thisPageTime;
            console.log(`Page ${page} imported in ${delta} ms.`);
        }
        console.log(`Cards imported. ${totalCards} total cards processed in ${(totalTime / 60000).toPrecision(4)} minutes.`);
    } catch (err) {
        console.log(err);
        console.log(`Card import error - restarting at page ${page}.`);
        await writeCards(page)
    }
};

async function writeSets() {
    try {
        const sets = await scryfall.allSets();
        let columns = sets.reduce((columns, set) => {
            Object.keys(set).forEach((column) => !columns.has(column) && columns.add(column));
            return columns;
        }, new Set());
        await knex.batchInsert("scryfall.set", sets.map((set) => {
            columns.forEach((column) => {
                if (typeof (set[column]) === "undefined") {
                    set[column] = null;
                }
            });
            if (isNaN(Date.parse(set["released_at"]))) {
                set["released_at"] = null;
            }
            return set; // Sort null parent codes before non-null for FK restraint.
        }, sets).sort((a, b) => !b.parent_set_code - !a.parent_set_code)).then();
        console.log(`Sets imported. ${sets.length} total sets were processed.`);
    } catch (err) {
        console.log(err);
    }
}

async function writeRulings() {
    try {
        for (const card of cards) {
            try {
                const rulings = await scryfall.getRulings(card.id);
                for (const ruling of rulings) {
                    await knex("scryfall.ruling").insert(Object.assign({
                        card_id: card.id
                    }, ruling));
                }
            } catch (err) {
                debugger;
            }
        }
    } catch (err) {
        console.log(err);
    }
}


(async function () {
    await new ScryfallSet(knex).buildTable();
    await writeSets();
    await new ScryfallCard(knex).buildTable();
    await writeCards();
    await new ScryfallRuling(knex).buildTable();
    await writeRulings();
    process.exit();
}());