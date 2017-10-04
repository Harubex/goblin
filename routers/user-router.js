const debug = require("debug")("server/user");
const express = require("express");
const bcrypt = require("bcrypt");
const DBConnection = require("../data/db-conn");
const send = require("./static-router");

const router = express.Router();
const conn = new DBConnection();

router.get("/login", (req, resp) => {
    send(req, resp, {});
});

router.get("/register", (req, resp) => {
    send(req, resp, {});
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
                        req.session.userid = data[0].id;
                        req.session.username = body.username;
                        req.session.save((err) => {
                            if (err) {
                                debug(err);
                            } else {
                                resp.status(200).send(data[0]);
                            }
                        });
                    }
                });
            }
        });
       /* docClient.scan({
            TableName: "Accounts",
            FilterExpression : "username = :username",
            ExpressionAttributeValues : {":username" : req.body.username}
        }, (err, data) => {
            if (err) {
                resp.status(500).send(err.message);
            } else {
                 if (data.Count === 1) {
                     bcrypt.compare(req.body.password, data.Items[0].password, (err, res) => {
                        if (err) {
                            resp.status(500).send(err.message);
                        } else if (!res) {
                            resp.status(500).send("Incorrect password.");
                        } else {
                            req.session.userid = data.Items[0].id;
                            req.session.username = req.body.username;
                            req.session.save((err) => {
                                if (err) {
                                    debug(err);
                                } else {
                                    resp.status(200).send(data.Items[0]);
                                }
                            })
                        }
                    });
                 } else {
                     resp.status(500).send("No user with this username found.");
                 }
            }
        });*/
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
                        conn.query("insert into users (name, password) values (?, ?)", [body.username, hash], (err, data) => {
                            if (err) {
                                resp.status(500).send(err.message);
                            } else {
                                req.session.userid = data[0].id;
                                req.session.username = body.username;
                                req.session.save((err) => {
                                    if (err) {
                                        debug(err);
                                    } else {
                                        resp.status(200).send(data[0]);
                                    }
                                });
                            }
                        });
                    }
                });
            }
        });
    }
});

module.exports = router;