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
            if (!await this.schema.hasTable("object")) {
                await this.schema.raw("drop type if exists scryfall_object");
                await this.schema.raw("create type scryfall_object as enum ('set', 'card', 'ruling')");
                await this.schema.createTable("object", (table) => {
                    table.comment("Base table for Scryfall objects.");
                    table.specificType("object", "scryfall_object").notNullable();
                });   
            }
        } catch (err) {
            debug(err);
        }
    }
}