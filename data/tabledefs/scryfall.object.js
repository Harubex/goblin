const Knex = require("knex");
const debug = require("debug")("tabledef/object");

module.exports = class ScryfallObject {
    /**
     * 
     * @param {Knex} knex 
     */
    constructor(knex) {
        this.schema = knex.schema.withSchema("scryfall");
    }

    async buildTable() {
        try {
            if (!this.schema.hasTable("object")) {
                await this.schema.createTable("object", (table) => {
                    table.comment("Base table for Scryfall objects.");
                    table.string("object", 16).notNullable();
                });
            }
        } catch (err) {
            debug(err);
        }
    }
}