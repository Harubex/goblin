const fs = require("fs");
const path = require("path");
const debug = require("debug")("server/api");
const express = require("express");
const scryfall = require("scryfall");
const send = require("./static-router");
const DBConnection = require("../data/db-conn");
const images = require("../data/images");

const router = express.Router();
const conn = new DBConnection();

router.get("/", (req, resp) => {
    send(req, resp, {
    });
});

module.exports = router;