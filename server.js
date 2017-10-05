const fs = require("fs");
const path = require("path");
const https = require("https");
const express = require("express");
const debug = require("debug")("server");
const helmet = require("helmet");
const compression = require("compression");
const mysql = require("mysql");
const uuid = require("uuid/v4");
const session = require("express-session");
const bodyParser = require("body-parser");
const DynamoStore = require("connect-dynamodb")({session: session});

const app = express();
const port = 8000;

if (process.env.rebuilding) {
    let rebuild = require("./data/rebuild");
    rebuild.buildScryfallDB();
    rebuild.buildMtgJsonDB();
}

app.set("title", "Goblin Guide");
let cookieSecure = false;
if (process.env.NODE_ENV === "production") {
    app.set("trust proxy", 1);
    cookieSecure = true;
}

app.use(compression());
app.use(helmet());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(session({
    secret: "sampletext123",
    name: "goblin-cookie",
    store: new DynamoStore({
        table: "UserSessions",
        AWSConfigJSON: JSON.parse(fs.readFileSync(path.join(__dirname, "credentials/dynamo-creds.json"), "utf8"))
    }),
    genid: uuid,
    secure: cookieSecure
}));
app.use("/card", require("./routers/card-router"));
app.use("/user", require("./routers/user-router"));
app.use("/api", require("./routers/api-router"));
app.use("/collections", require("./routers/collections-router"));
app.use(express.static("build"));
app.use(express.static("static"));
app.use(require("./middleware/404"));

let server = app;
if (process.env.NODE_ENV !== "production") {
    server = https.createServer({
        key: fs.readFileSync(path.join(__dirname, "test-key.pem")),
        cert: fs.readFileSync(path.join(__dirname, "test-cert.pem"))
    }, app);
}
server.listen(port);