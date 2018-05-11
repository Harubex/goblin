const AWS = require("aws-sdk");
const scryfall = require("scryfall");

AWS.config.update(require("../credentials/dynamo-creds.json"));

const dynamo = new AWS.DynamoDB.DocumentClient({
    convertEmptyValues: true
});

let totalCards = 0;
module.exports = async () => {
    for (let i = 0; await writePage(i); i++);
    console.log(`Cards imported. ${totalCards} total cards processed.`);
};

/**
 * @param {number} page
 * @returns {Promise<boolean>}
 */
async function writePage(page) {
    const cards = await scryfall.getAllCards(page);
    console.log(`Page ${page}: ${cards.length} cards.`);
    for (let i = 0; i < cards.length; i += 25) {
        await dynamo.batchWrite({
            RequestItems: {
                "CardData": cards.slice(i, i + 25).map((card) => ({
                    PutRequest: {
                        Item: card
                    }
                }))
            }
        }).promise();
    }
    totalCards += cards.length;
    return !!cards.length;
}
