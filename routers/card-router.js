const fs = require("fs");
const path = require("path");
const debug = require("debug")("server/api");
const express = require("express");
const scryfall = require("scryfall");

const htmlPath = path.join(__dirname, "..", "src", "index.html");
const router = express.Router();

let cache = [];

router.get("/:set/:code", (req, resp) => ***REMOVED***
    // Check if card data is cached.
    if (cache[req.params.set] && cache[req.params.set][req.params.code]) ***REMOVED***
        sendResp(resp, cache[req.params.set][req.params.code]);
    ***REMOVED*** else ***REMOVED***
        // Fetch data if not cached.
        scryfall.getCard(req.params.set, parseInt(req.params.code), (err, card) => ***REMOVED***
            if (err) ***REMOVED***
                resp.status(404).send(err.message);
            ***REMOVED*** else ***REMOVED***
                if (!cache[req.params.set]) ***REMOVED***
                    cache[req.params.set] = [];
                ***REMOVED***
                cache[req.params.set][req.params.code] = card;
                sendResp(resp, card);
            ***REMOVED***
        ***REMOVED***);
    ***REMOVED***
***REMOVED***);

function sendResp(resp, cardData) ***REMOVED***
    fs.readFile(htmlPath, "utf8", (err, fileData) => ***REMOVED***
        if (err) ***REMOVED***
            debug("Unable to fetch html.");
            resp.status(500).send(err.message);
        ***REMOVED*** else if (cardData == null) ***REMOVED***
            resp.status(404).send("Could not fetch card data.");
        ***REMOVED*** else ***REMOVED***
            resp.send(fileData.replace("***REMOVED***state***REMOVED***", JSON.stringify(cardData)));
        ***REMOVED***
    ***REMOVED***);
***REMOVED***

module.exports = router;