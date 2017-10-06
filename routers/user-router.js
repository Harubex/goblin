const debug = require("debug")("server/user");
const express = require("express");
const bcrypt = require("bcrypt");
const DBConnection = require("../data/db-conn");
const send = require("./static-router");

const router = express.Router();
const conn = new DBConnection();

router.get("/login", send);
router.get("/register", send);

router.get("/logout", (req, resp) => {
    req.session.destroy((err) => {
        if (err) {
            debug(err);
        }
        resp.redirect("back");
    });
});

router.post("/login", (req, resp) => {
    const body = req.body || {};
    if (!body.username) {
        resp.status(400).send("A username is required.");
    } else if (!body.password) {
        resp.status(400).send("A password is required.");
    } else if (body.username.length > 64) {
        resp.status(400).send("The given username is too long.");
    } else {
        conn.query(`select * from users where name = ?;`, [body.username], (err, data) => {
            if (err) {
                resp.status(500).send(err.message);
            } else if (data.length == 0) {
                resp.status(400).send("No user with this name exists.");
            } else {
                bcrypt.compare(body.password, data[0].password, (err, passwordValid) => {
                    if (err) {
                        debug("Password comparison failed.");
                    } else if (!passwordValid) {
                        resp.status(400).send("The given password is invalid.");
                    } else {
                        addSessionData(req, {
                            userid: data[0].id,
                            username: body.username
                        }, () => resp.redirect("/collections"));
                    }
                });
            }
        });
    }
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
                        conn.query("insert into users (name, password) values (?, ?); select * from users where name = ?;", 
                        [body.username, hash, body.username], (err, data) => {
                            if (err) {
                                resp.status(500).send(err.message);
                            } else {
                                addSessionData(req, {
                                    userid: data[1][0].id,
                                    username: body.username
                                }, () => resp.redirect("/collections"));
                            }
                        });
                    }
                });
            }
        });
    }
});

function addSessionData(req, data, cb) {
    for (let key in data) {
        req.session[key] = data[key];
    }
    req.session.save((err) => {
        if (err) {
            debug(err);
        } else {
            cb();
        }
    });
}

module.exports = router;