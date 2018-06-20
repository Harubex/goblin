const mysql = require("mysql");
const scryfall = require("scryfall");
const { knex } = require("./db-conn");

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
            let columns = pageCards.reduce((columns, card) => {
                Object.keys(card).forEach((column) => !columns.has(column) && columns.add(column));
                return columns;
            }, new Set());
            await knex.batchInsert("scryfall.card", pageCards.map((card) => {
                for (let key in card) { 
                    if (card[key] && typeof (card[key]) === "object") {
                        card[key] = JSON.stringify(card[key]);
                    } 
                }
                return card;
            })).then();
            let thisPageTime = new Date();
            let delta = thisPageTime - lastPageTime;
            totalTime += delta;
            lastPageTime = thisPageTime;
            console.log(`Page ${page} imported in ${delta} ms.`);
        }
        console.log(`Cards imported. ${totalCards} total cards processed in ${totalTime / 60000} minutes.`);
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
            columns.forEach((column) => set[column] = set[column] || null);
            if (isNaN(Date.parse(set["released_at"]))) {
                set["released_at"] = new Date(set["released_at"]);
            }
            return set; // Sort null parent codes before non-null for FK restraint.
        }, sets).sort((a, b) => !b.parent_set_code - !a.parent_set_code)).then();
        console.log(`Sets imported. ${sets.length} total sets were processed.`);
    } catch (err) {
        console.log(err);
    }
}

async function truncateTable(tableName) {
    await knex.raw("set FOREIGN_KEY_CHECKS = 0;");
    try {
        await knex.raw(`truncate ${tableName};`);
        console.log(`Table '${tableName}' has been truncated.`);
    } catch (err) {
        console.log(`Unable to truncate table '${tableName}':`, err);
    } finally {
        await knex.raw("set FOREIGN_KEY_CHECKS = 1;");
    }
}

(async function () {
    await truncateTable("`scryfall`.`set`");
    await writeSets();
    await truncateTable("`scryfall`.`card`");
    await writeCards();
    process.exit();
}());