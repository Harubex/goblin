const debug = require("debug")("server/api");
const express = require("express");
const React = require("react");
const ReactDOMServer = require("react-dom/server");
const { knex } = require("../data/db-conn");

const router = express.Router();

router.get("/", async (req, resp) => {
    resp.send(ReactDOMServer.renderToString(React.createElement("div", null, "Hello there")));
});

module.exports = router;