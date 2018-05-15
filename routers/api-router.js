const debug = require("debug")("server/api");
const express = require("express");
const { knex } = require("../data/db-conn");

const router = express.Router();

module.exports = router;