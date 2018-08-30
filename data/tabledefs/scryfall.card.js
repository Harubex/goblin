const debug = require("debug")("tabledef/card");

const ScryfallObject = require("./scryfall.object");

module.exports = class ScryfallCard extends ScryfallObject {
    async buildTable() {
        await this.schema.dropTableIfExists("card");
        await super.buildTable();
        try {
            await this.schema.createTable("card", (table) => {
                table.comment("Card data from Scryfall.");
                table.inherits("scryfall.object");
                table.uuid("id").notNullable().unique().primary();
                table.uuid("oracle_id").notNullable();
                table.json("multiverse_ids");
                table.integer("mtgo_id").unsigned();
                table.integer("mtgo_foil_id").unsigned();
                table.integer("arena_id").unsigned();
                table.string("uri", 512).notNullable();
                table.string("scryfall_uri", 512).notNullable();
                table.string("prints_search_uri", 512).notNullable();
                table.string("rulings_uri", 512).notNullable();
                table.string("name", 512).notNullable();
                table.string("printed_name", 512);
                table.string("lang", 8);
                table.text("layout").notNullable();
                table.float("cmc", 2).notNullable();
                table.string("type_line", 512).notNullable();
                table.string("printed_type_line", 512);
                table.string("oracle_text", 2048);
                table.string("printed_text", 2048);
                table.text("mana_cost");
                table.string("power", 8);
                table.string("toughness", 8);
                table.string("loyalty", 8);
                table.string("life_modifier", 8);
                table.string("hand_modifier", 8);
                table.json("colors");
                table.json("color_indicator");
                table.json("color_identity");
                table.json("all_parts");
                table.json("card_faces");
                table.json("legalities").notNullable();
                table.boolean("reserved").notNullable();
                table.boolean("foil").notNullable();
                table.boolean("nonfoil").notNullable();
                table.boolean("oversized").notNullable();
                table.integer("edhrec_rank");
                table.string("set", 8).notNullable();
                table.string("set_name", 128).notNullable();
                table.string("collector_number", 16).notNullable();
                table.string("set_search_uri", 512).notNullable();
                table.json("image_uris");
                table.boolean("highres_image").notNullable();
                table.boolean("reprint").notNullable();
                table.boolean("digital").notNullable();
                table.string("rarity", 8).notNullable();
                table.string("flavor_text", 1024);
                table.string("artist", 128);
                table.uuid("illustration_id");
                table.string("frame", 8).notNullable();
                table.boolean("full_art").notNullable();
                table.string("watermark", 64);
                table.string("border_color", 16).notNullable();
                table.integer("story_spotlight_number", 2);
                table.string("story_spotlight_uri", 512);
                table.boolean("timeshifted").notNullable();
                table.boolean("colorshifted").notNullable();
                table.boolean("futureshifted").notNullable();
                table.string("set_uri", 512).notNullable();
                table.string("scryfall_set_uri", 512).notNullable();
                table.specificType("usd", "money");
                table.specificType("eur", "money");
                table.specificType("tix", "money");
                table.json("related_uris").notNullable();
                table.json("purchase_uris").notNullable();
                
                table.index("name");
                table.index("set");
                table.index("collector_number");
                table.index("lang");
            });
        } catch (err) {
            debug(err);
        }
    }
}