const debug = require("debug")("tabledef/set");

const ScryfallObject = require("./scryfall.object");

module.exports = class ScryfallSet extends ScryfallObject {
    async buildTable() {
        await this.schema.dropTableIfExists("set");
        await super.buildTable();
        try {
            await this.schema.createTable("set", (table) => {
                table.comment("Set data from Scryfall.");
                table.inherits("scryfall.object");
                table.string("code", 8).notNullable().unique().primary();
                table.string("mtgo_code", 8);
                table.string("name", 128).notNullable();
                table.string("set_type", 16).notNullable();
                table.date("released_at");
                table.string("block_code", 4);
                table.string("block", 128);
                table.string("parent_set_code", 4).references("code").inTable("scryfall.set");
                table.specificType("card_count", "smallint").unsigned().notNullable();
                table.boolean("digital").unsigned().notNullable();
                table.boolean("foil_only").unsigned().notNullable();
                table.string("icon_svg_uri").notNullable();
                table.string("uri");
                table.string("search_uri");
                table.string("scryfall_uri");

                table.index("name");
            });
        } catch (err) {
            debug(err);
        }
    }
}