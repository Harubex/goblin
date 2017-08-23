const fs = require("fs");
const path = require("path");
const debug = require("debug")("server/api");
const express = require("express");
const scryfall = require("scryfall");

const htmlPath = path.join(__dirname, "..", "src", "index.html");

const router = express.Router();

let cache = [];

router.get("/:set/:code", (req, resp) => ***REMOVED***
    if (cache[req.params.set] && cache[req.params.set][req.params.code]) ***REMOVED***
        fs.readFile(htmlPath, "utf8", (err, data) => ***REMOVED***
            resp.send(data.replace("***REMOVED***content***REMOVED***", "").replace("***REMOVED***state***REMOVED***", JSON.stringify(cache[req.params.set][req.params.code])));
        ***REMOVED***);
    ***REMOVED*** else ***REMOVED***
        scryfall.getCard(req.params.set, parseInt(req.params.code), (err, card) => ***REMOVED***
            if (err) ***REMOVED***
                resp.status(404).send(err.message);
            ***REMOVED*** else ***REMOVED***
                if (!cache[req.params.set]) ***REMOVED***
                    cache[req.params.set] = [];
                ***REMOVED***
                cache[req.params.set][req.params.code] = card;
                fs.readFile(htmlPath, "utf8", (err, data) => ***REMOVED***
                    resp.send(data.replace("***REMOVED***state***REMOVED***", JSON.stringify(card)));
                ***REMOVED***);
            ***REMOVED***
        ***REMOVED***);
    ***REMOVED***
***REMOVED***);

module.exports = router;