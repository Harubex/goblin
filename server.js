const debug = require("debug")("server");
const fs = require("fs");
const path = require("path");
const https = require("https");

const port = 8000;
const start = new Date();
const app = require("./app");

let server = app;
if (process.env.NODE_ENV !== "production") {
    server = https.createServer({
        key: fs.readFileSync(path.join(__dirname, "./credentials/test-key.pem")),
        cert: fs.readFileSync(path.join(__dirname, "./credentials/test-cert.pem"))
    }, app);
}
server.listen(port, () => {
    debug(`Server started. Load time: ${(new Date() - start) / 1000} seconds.`);
});