const path = require("path");
const debug = require("debug")("server/error");

module.exports = (err, req, resp, next) => {
    debug(err);
    resp.status(500).send(err);
};