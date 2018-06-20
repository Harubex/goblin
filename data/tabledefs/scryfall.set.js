const Knex = require("knex")();

/**
 * 
 * @param {Knex} knex 
 */
module.exports = async (knex) => {
    const schema = knex.schema.withSchema("scryfall");
    const exists = await schema.hasTable("set");
    if (!exists) {
        const res = await schema.createTable("set", (table) => {
            table.comment("Set data from Scryfall.");
            table.charset("utf8mb4");
            table.engine("InnoDB");
            table.string("code", 8).notNullable().unique().primary();
            table.string("mtgo_code", 8).notNullable();
            table.string("name", 128).notNullable();
            table.string("set_type", 16).notNullable();
            table.dateTime("released_at");
            table.string("block_code", 4);
            table.string("parent_set_code", 4).references("code").inTable("set");
            table.specificType("card_count", "smallint(4)").unsigned().notNullable();
            table.boolean("digital").unsigned().notNullable();
            table.boolean("foil_only").unsigned().notNullable();
            table.string("icon_svg_uri").notNullable();
            table.string("uri");
            table.string("search_uri");
            table.string("scryfall_uri");
            table.specificType("object", "char(3)").notNullable();
        });
    }
};