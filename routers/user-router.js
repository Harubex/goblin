const debug = require("debug")("server/user");
const express = require("express");
const bcrypt = require("bcrypt");
const DBConnection = require("../data/db-conn");
const send = require("./static-router");
const squel = require("squel");

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
        sendError(req, resp, "A username is required.");
    } else if (!body.password) {
        sendError(req, resp, "A password is required.");
    } else if (body.username.length > 64) {
        sendError(req, resp, "The given username is too long.");
    } else {
        conn.query(squel.select().from("users").where("name = ?", body.username), (err, data) => {
            if (err) {
                sendError(req, resp, err.message);
            } else if (data.length == 0) {
                sendError(req, resp, "No user with this name exists.");
            } else {
                bcrypt.compare(body.password, data[0].password, (err, passwordValid) => {
                    if (err) {
                        debug("Password comparison failed.");
                    } else if (!passwordValid) {
                        sendError(req, resp, "The given password is invalid.");
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
    if (!body.confirm || body.password != body.confirm) {
        sendError(req, resp, "The provided passwords don't match.");
    } else if (!body.username) {
        sendError(req, resp, "A username is required.");
    } else if (!body.password) {
        sendError(req, resp, "A password is required.");
    } else if (body.username.length > 64) {
        sendError(req, resp, "The given username is too long.");
    } else {
        conn.query(squel.select().from("users").field("count(*)", "userCount").where("name = ?", body.username), (err, res) => {
            if (err) {
                sendError(req, resp, err.message);
            } else if (res[0].userCount > 0) {
                sendError(req, resp, "A user with this name already exists.");
            } else {
                bcrypt.hash(body.password, 13, (err, hash) => {
                    if (err) {
                        sendError(req, resp, err.message);
                    } else {
                        var a = squel.insert().into("users").setFields({
                            name: body.username,
                            password: hash
                        });
                        var b = squel.select().from("users").where("name = ?", body.username).toParam();
                        conn.query("insert into users (name, password) values (?, ?); select * from users where name = ?;", 
                        [body.username, hash, body.username], (err, data) => {
                            if (err) {
                                sendError(req, resp, err.message);
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

function sendError(req, resp, error) {
    send(req, resp, {
        error: error
    });
}

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