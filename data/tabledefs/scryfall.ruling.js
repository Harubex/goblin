const debug = require("debug")("tabledef/ruling");

const ScryfallObject = require("./scryfall.object");

module.exports = class ScryfallRuling extends ScryfallObject {
    async buildTable() {
        await this.schema.dropTableIfExists("ruling");
        await super.buildTable();
        try {
            await this.schema.createTable("ruling", (table) => {
                table.comment("Ruling data from Scryfall.");
                table.inherits("scryfall.object");
                table.uuid("card_id").notNullable();
                table.text("comment").notNullable();
                table.date("published_at").notNullable();
                table.string("source", 32).notNullable();
                table.primary(["card_id", "comment"]);
            });
        } catch (err) {
            debug(err);
        }
    }
}