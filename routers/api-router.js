const debug = require("debug")("server/api");
const express = require("express");
const DBConnection = require("../data/db-conn");

const router = express.Router();
const conn = new DBConnection();

router.get("/ping", (req, resp) => ***REMOVED***
    resp.json(["pong"]);
***REMOVED***);

router.get("/card", (req, resp) => ***REMOVED***
    res("select * from card", ***REMOVED******REMOVED***, resp);
***REMOVED***);

router.get("/test", (req, resp) => ***REMOVED***
    res("select * from scryfall_cards", ***REMOVED******REMOVED***, resp);
***REMOVED***);

function res(query, args, resp) ***REMOVED***
    conn.query(query, args, (err, res) => ***REMOVED***
        if (err) ***REMOVED***
            debug(err);
            resp.status(500).json(***REMOVED***
                error: err.message
            ***REMOVED***);
        ***REMOVED*** else ***REMOVED***       
            resp.status(200).json(res);
        ***REMOVED***
    ***REMOVED***);
***REMOVED***

module.exports = router;