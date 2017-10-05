const fs = require("fs");
const path = require("path");
const debug = require("debug")("test");
const htmlPath = path.join(__dirname, "..", "src", "index.html");

module.exports = function send(req, resp, data) {
    fs.readFile(htmlPath, "utf8", (err, fileData) => {
        if (err) {
            debug("Unable to fetch html.");
            resp.status(500).send(err.message);
        } else if (data == null) {
            resp.status(404).send("Could not fetch data.");
        } else {
            req.session.reload((err) => {
                if (err) {
                    debug(err);
                    req.session.regenerate((err) => {
                        if (err) {
                            debug(err);
                        }
                        resp.send(fileData.replace("{state}", JSON.stringify(data)));
                    });
                } else {
                    resp.send(fileData.replace("{state}", JSON.stringify(data)));
                }
            })
        }
    });
}
