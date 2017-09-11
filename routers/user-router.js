const debug = require("debug")("server/user");
const express = require("express");
const bcrypt = require("bcrypt");
const DBConnection = require("../data/db-conn");

const router = express.Router();
const conn = new DBConnection();

router.post("/login", (req, resp) => {

});

router.post("/register", (req, resp) => {
    const body = req.body || {};
    if (!body.username) {
        resp.status(400).send("A username is required.");
    } else if (!body.password) {
        resp.status(400).send("A password is required.");
    } else if (body.username.length > 64) {
        resp.status(400).send("The given username is too long.");
    } else {
        conn.query("select count(*) as userCount from users where name = ?", { name: body.username }, (err, res) => {
            if (err) {
                resp.status(500).send(err.message);
            } else if (res[0].userCount > 0) {
                resp.status(500).send("A user with this name already exists.");
            } else {
                bcrypt.hash(body.password, 13, (err, hash) => {
                    if (err) {
                        resp.status(500).send(err.message);
                    } else {
                        conn.query("insert into users (name, password) values (?, ?)", [body.username, hash], (err, res) => {
                            if (err) {
                                resp.status(500).send(err.message);
                            } else {
                                resp.redirect("/collections");
                            }
                        });
                    }
                });
            }
        });
    }
});

module.exports = router;