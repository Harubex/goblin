const AWS = require("aws-sdk");

AWS.config.update(require("./credentials/dynamo-creds.json"));

const dyn = new AWS.DynamoDB.DocumentClient();

writePage().then((onFulfilled, b) => {

})

/**
 * @returns {Promise<AWS.DynamoDB.DocumentClient.BatchWriteItemOutput, AWS.AWSError>}
 */
async function writePage() {
    return await dyn.batchWrite({
        RequestItems: {
            "CardData": [
                
            ]
        }
    }).promise();
}
dyn.putItem({
    TableName: "CardData",
    Item: {
        "id": {
            S: "test12"
        },
        "name": {
            S: "test22"
        }
    }
}, function(err, data) {
    if (err) {
      console.log("Error", err);
    } else {
      console.log("Success", data);
    }
});
