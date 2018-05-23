const fs = require("fs");
const path = require("path");
const util = require("util");
const serialize = require("serialize-javascript");
const debug = require("debug")("server/static");
const htmlPath = path.join(__dirname, "..", "src", "index.html");
const readFile = util.promisify(fs.readFile);

/**
 * 
 * @param {Request} req 
 * @param {Response} resp 
 * @param {any} data 
 */
module.exports = async (req, resp, title, stateData = {}) => {
    resp.send(`
        <!DOCTYPE html>
        <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1">
                <title>Goblin Guide | ${typeof (title) === "string" ? title : "Sample Text"}</title>
                <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/keyrune@latest/css/keyrune.min.css">
                <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/mana-font@latest/css/mana.min.css">
                <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500">
            </head>
            <body style="background-color: #333333"> <!-- Temporary, for the sake of my eyes. -->
                <div id="base-container"></div>
                <script>window.serverState = ${serialize(stateData || {})};</script>
                <script src="/bundle.js"></script>
            </body>
        </html>
    `);
}
