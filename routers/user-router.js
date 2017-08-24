const debug = require("debug")("server/user");
const express = require("express");
const bcrypt = require("bcrypt");
const DBConnection = require("../data/db-conn");

const router = express.Router();
const conn = new DBConnection();

router.post("/login", (req, resp) => ***REMOVED***

***REMOVED***);

router.post("/register", (req, resp) => ***REMOVED***
    const body = req.body || ***REMOVED******REMOVED***;
    if (!body.username) ***REMOVED***
        resp.status(500).send("A username is required.");
    ***REMOVED*** else if (!body.password) ***REMOVED***
        resp.status(500).send("A password is required.");
    ***REMOVED*** else ***REMOVED***
        connection.query
        resp.redirect("/");
    ***REMOVED***
***REMOVED***);

module.exports = router;