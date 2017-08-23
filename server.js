const fs = require("fs");
const express = require("express");
const debug = require("debug")("server");
const helmet = require("helmet");
const compression = require("compression");
const mysql = require("mysql");

const app = express();
const port = 8000;

app.set("title", "Goblin Guide");
app.use(compression());
app.use(helmet());
app.use(express.static("build"));
app.use(express.static("static"));
app.use("/card", require("./routers/card-router"));
app.use("/api", require("./routers/api-router"));
app.use(require("./middleware/404"));

app.listen(port, (resp) => {
    debug(`Server is running on port ${port}.`);
});