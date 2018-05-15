const debug = require("debug")("server/user");
const express = require("express");
const bcrypt = require("bcrypt");
const { knex } = require("../data/db-conn");
const send = require("./static-router");

const router = express.Router();
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
        const user = await getUser(body.username);
        if (user) {
            throw new Error("No user with this name exists.");
        }
        const valid = await bcrypt.compare(body.password, user.password);
        if (!passwordValid) {
            throw new Error("The given password is invalid.");
        }
        await addSessionData(req, {
            userid: user.id,
            username: body.username
        });
        resp.redirect("/collections");
    } catch (error) {
        debug(error);
        send(req, resp, { error });
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
        const user = await getUser(body.username);
        if (user) {
            throw new Error("A user with this name already exists.");
        }
        const userId = (await knex.insert({
            name: body.username,
            password: await bcrypt.hash(body.password, saltRounds)
        }).into("users").returning("id")).pop();
        debug(`User created with id ${userId}.`);
        await addSessionData(req, {
            userid: userId,
            username: body.username
        });
        resp.redirect("/collections");
    } catch (error) {
        debug(error);
        send(req, resp, { error });
    }
});

/**
 * Gets a user, or undefined if one doesn't exist.
 * @param {string} username 
 */
async function getUser(username) {
    return await knex.select().first().from("users").where("name", username);
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