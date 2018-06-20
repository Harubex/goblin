const debug = require("debug")("server/api");
const express = require("express");
const { knex } = require("../data/db-conn");

const { Model } = require("bookshelf")(knex);

class Set extends Model {
    get tableName() {
        return "scryfall.set";
    }
}

const router = express.Router();

router.get("/:name", async (req, resp) => {
    resp.json(await Set.where("name = '" + req.params.name + "'").then());
});

module.exports = router;