const helmet = require("helmet");
const express = require("express");
const compression = require("compression");
const session = require("express-session");
var MySQLStore = require("express-mysql-session")(session);

const app = express();

let cookieSecure = false;
if (process.env.NODE_ENV === "production") {
    app.set("trust proxy", 1);
    cookieSecure = true;
}

app.use(
    // Middleware functions - order matters.
    compression(), // Compress responses (todo: add caching - https://serversforhackers.com/c/nginx-caching)
    helmet(), // Changes default headers to something more reasonable.
    express.urlencoded({ // Parses application/x-www-form-urlencoded responses.
        extended: false // Prevents objects/arrays from being encoded.
    }),
    express.json(), // Parses application/json responses.
    session({ // Sets session store and other session options.
        cookie: {
            // Set cookie to expire in about a week.
            expires: (() => {
                const date = new Date();
                date.setDate(date.getDate() + 7);
                return date;
            })(),
            httpOnly: false,

        },
        secret: "sampletext123",
        name: "goblin-cookie",
        store: new MySQLStore(require("./credentials/mysql-creds.json")),
        genid: require("uuid/v4"),
        secure: cookieSecure,
        resave: false,
        saveUninitialized: false
    })
);

// Application routes.
app.use("/collections", require("./routers/collections-router"));
app.use("/cards", require("./routers/card-router"));
app.use("/test", require("./routers/test-router"));
app.use("/user", require("./routers/user-router"));
//app.use("/sets", require("./routers/set-router"));
app.use(express.static("./build"));
app.use(express.static("./static"));
app.use(require("./middleware/404"));
app.use(require("./middleware/error"));

module.exports = app;