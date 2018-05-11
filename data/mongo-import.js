const mongodb = require("mongodb");
const MongoClient = mongodb.MongoClient;
const scryfall = require("scryfall");



let totalCards = 0;
module.exports = async () => {
    const conn = await MongoClient.connect(require("../credentials/mongo-creds.json").uri);

    const db = conn.db("magical");
    const collection = db.collection("card_data");
    for (let i = 0; await writePage(i, collection); i++);
    console.log(`Cards imported. ${totalCards} total cards processed.`);
    await conn.close();
};

/**
 * @param {number} page
 * @param {mongodb.Collection<any>} collection
 * @returns {Promise<boolean>}
 */
async function writePage(page, collection) {
    const cards = await scryfall.getAllCards(page);
    console.log(`Page ${page}: ${cards.length} cards.`);
    if (cards.length > 0) {
        const result = await collection.insertMany(cards);
        console.log(result.insertedCount);
        totalCards += cards.length;
    }
    return !!cards.length;
}
