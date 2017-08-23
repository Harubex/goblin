const debug = require("debug")("server/api");
const express = require("express");
const connection = require("../data/db-conn")(***REMOVED***
    host: "localhost",
    user: "root",
    password: "iLevel258",
    database: "magical"
***REMOVED***);

const router = express.Router();

router.get("/ping", (req, resp) => ***REMOVED***
    resp.json(["pong"]);
***REMOVED***);

router.get("/card", (req, resp) => ***REMOVED***
    connection.query("select * from card", ***REMOVED******REMOVED***, (err, res) => ***REMOVED***
        if (err) ***REMOVED***
            debug(err);
            resp.status(500).json(***REMOVED***
                error: err.message
            ***REMOVED***);
        ***REMOVED*** else ***REMOVED***       
            resp.status(200).json(res);
        ***REMOVED***
    ***REMOVED***);
***REMOVED***);

module.exports = router;