const path = require("path");

const message = "No content was found at this location.";
const rootPath = path.join(__dirname, "..");
module.exports = (req, resp) => {
    resp.status(404);
    if (req.accepts("html")) {
        resp.sendFile("404.html", {
            root: rootPath
        });
    } else if (req.accepts("json")) {
        resp.json({ error: message });
    } else {
        resp.type("txt").send(message);
    }
};