const debug = require("debug")("server/user");
const express = require("express");
const bcrypt = require("bcrypt");
const { DBConnection, select, insert } = require("../data/db-conn");
const send = require("./static-router");

const router = express.Router();
const conn = new DBConnection();
const saltRounds = 13; // Used for password encryption. 13 is a decent middle ground.

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

router.post("/login", async (req, resp) => {
    try { 
        const body = req.body || {};
        if (!body.username) {
            throw new Error("A username is required.");
        }
        if (!body.password) {
            throw new Error("A password is required.");
        }
        if (body.username.length > 64) {
            throw new Error("The given username is too long.");
        }
        const data = await conn.query(select("users").where("name = ?", body.username));
        if (data.length == 0) {
            throw new Error("No user with this name exists.");
        }
        const valid = await bcrypt.compare(body.password, data[0].password);
        if (!passwordValid) {
            throw new Error("The given password is invalid.");
        }
        await addSessionData(req, {
            userid: data[0].id,
            username: body.username
        });
        resp.redirect("/collections");
    } catch (err) {
        sendError(req, resp, err.message);
    }
});

router.post("/register", async (req, resp) => {
    try {
        const body = req.body || {};
        if (!body.confirm || body.password != body.confirm) {
            throw new Error("The provided passwords don't match.");
        }
        if (!body.username) {
            throw new Error("A username is required.");
        }
        if (!body.password) {
            throw new Error("A password is required.");
        }
        if (body.username.length > 64) {
            throw new Error("The given username is too long.");
        }
        const res = await conn.query(select("users").field("count(*)", "userCount").where("name = ?", body.username));
        if (res[0].userCount > 0) {
            throw new Error("A user with this name already exists.");
        }
        const data = await conn.query([
            insert("users").setFields({
                name: body.username,
                password: await bcrypt.hash(body.password, saltRounds)
            }),
            select("users").where("name = ?", body.username)
        ]);
        await addSessionData(req, {
            userid: data[1][0].id,
            username: body.username
        });
        resp.redirect("/collections");
    } catch (err) {
        sendError(req, resp, err.message);
    }
});

function sendError(req, resp, error) {
    send(req, resp, {
        error: error
    });
}

/**
 * Adds the properties of an object to the current session.
 * @param {Request} req 
 * @param {Object} data 
 * @returns {Promise<void>}
 */
async function addSessionData(req, data) {
    for (let key in data) {
        req.session[key] = data[key];
    }
    return new Promise((resolve, reject) => {
        req.session.save((err) => {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        });
    });
}

module.exports = router;