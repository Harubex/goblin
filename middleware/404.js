const path = require("path");

const message = "No content was found at this location.";
const rootPath = path.join(__dirname, "..");
module.exports = (req, resp) => ***REMOVED***
    resp.status(404);
    if (req.accepts("html")) ***REMOVED***
        resp.sendFile("404.html", ***REMOVED***
            root: rootPath
        ***REMOVED***);
    ***REMOVED*** else if (req.accepts("json")) ***REMOVED***
        resp.json(***REMOVED*** error: message ***REMOVED***);
    ***REMOVED*** else ***REMOVED***
        resp.type("txt").send(message);
    ***REMOVED***
***REMOVED***;