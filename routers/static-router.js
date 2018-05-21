const fs = require("fs");
const path = require("path");
const util = require("util");
const debug = require("debug")("server/static");
const htmlPath = path.join(__dirname, "..", "src", "index.html");
const readFile = util.promisify(fs.readFile);

let pageCache = "";
/**
 * 
 * @param {Request} req 
 * @param {Response} resp 
 * @param {any} data 
 */
module.exports = async (req, resp, data) => {
    if (!pageCache) {
        try {
            pageCache = await readFile(htmlPath, "utf8");
        } catch (err) {
            debug("Unable to fetch index.html: ", err);
            resp.status(500).send(err.message);
        }
    }
    fileData = fileData.replace("{state}", JSON.stringify(serverState || {}));
    fileData = fileData.replace("{session}", JSON.stringify(sessionState || {}));
    resp.send(fileData);
}
