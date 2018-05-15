const fs = require("fs");
const path = require("path");
const https = require("https");
const express = require("express");
const debug = require("debug")("server");
const helmet = require("helmet");
const compression = require("compression");
const session = require("express-session");
const DynamoStore = require("connect-dynamodb")({session: session});

const app = express();
const port = 8000;
const start = new Date();

if (process.env.rebuilding) {
    const rebuild = require("./data/mysql-import");
    rebuild.writeSets();
    rebuild.writeCards();
}

app.set("title", "Goblin Guide");
let cookieSecure = false;
if (process.env.NODE_ENV === "production") {
    app.set("trust proxy", 1);
    cookieSecure = true;
}

app.use(compression());
app.use(helmet());
app.use(express.urlencoded({
    extended: false 
}));
app.use(express.json({
    strict: false
}));
app.use(session({
    secret: "sampletext123",
    name: "goblin-cookie",
    store: new DynamoStore({
        table: "UserSessions",
        AWSConfigPath: "./credentials/dynamo-creds.json"
    }),
    genid: require("uuid/v4"),
    secure: cookieSecure,
    resave: false,
    saveUninitialized: false
}));

app.use("/card", require("./routers/card-router"));
app.use("/user", require("./routers/user-router"));
//app.use("/api", require("./routers/api-router"));
app.use("/collections", require("./routers/collections-router"));
//app.use("/sets", require("./routers/set-router"));
app.use(express.static("./build"));
app.use(express.static("./static"));
app.use(require("./middleware/404"));
app.use(require("./middleware/error"));

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