const fs = require("fs");
const express = require("express");
const debug = require("debug")("server");
const helmet = require("helmet");
const compression = require("compression");
const mysql = require("mysql");
const uuid = require("uuid/v4");
const session = require("express-session");
const bodyParser = require("body-parser");
const MySQLStore = require("express-mysql-session")(session);

const app = express();
const port = 8000;
process.env.rebuilding = true;
if (process.env.rebuilding) {
    let rebuild = require("./data/rebuild");
    rebuild.buildScryfallDB();
    //rebuild.buildMtgJsonDB();
}


let cookieSecure = false;
app.set("title", "Goblin Guide");
if (process.env.NODE_ENV === "production") {
    app.set("trust proxy", 1);
    cookieSecure = true;
}

app.use(compression());
app.use(helmet());
app.use(bodyParser.urlencoded({ extended: false })) 
app.use(bodyParser.json())
app.use(session({
    secret: "sample text",
    name: "goblin-cookie",
    store: new MySQLStore(JSON.parse(fs.readFileSync("credentials/db-creds.json", "utf8"))),
    genid: uuid,
    secure: cookieSecure
}));
app.use("/card", require("./routers/card-router"));
app.use("/user", require("./routers/user-router"));
app.use("/api", require("./routers/api-router"));
app.use("/collections", require("./routers/collections-router"))
app.use(express.static("build"));
app.use(express.static("static"));
app.use(require("./middleware/404"));

app.listen(port, (resp) => {
    debug(`Server is running on port ${port}.`);
});