const debug = require("debug")("server/user");
const express = require("express");
const bcrypt = require("bcrypt");
const DBConnection = require("../data/db-conn");

const router = express.Router();
const conn = new DBConnection();

router.post("/login", (req, resp) => {

});

router.post("/register", (req, resp) => {
    const body = req.body || {};
    if (!body.username) {
        resp.status(500).send("A username is required.");
    } else if (!body.password) {
        resp.status(500).send("A password is required.");
    } else {
        connection.query
        resp.redirect("/");
    }
});

module.exports = router;