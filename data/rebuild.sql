DROP TABLE IF EXISTS `collection_card`;
DROP TABLE IF EXISTS `cards`;
DROP TABLE IF EXISTS `collections`;
DROP TABLE IF EXISTS `mtgjson_sets`;
DROP TABLE IF EXISTS `mtgjson_cards`;
DROP TABLE IF EXISTS `scryfall_sets`;
DROP TABLE IF EXISTS `scryfall_cards`;
DROP TABLE IF EXISTS `users`;

CREATE TABLE `mtgjson_cards` (
  `id` varchar(64) NOT NULL,
  `mtgjson_code` varchar(8) NOT NULL,
  `layout` varchar(16) DEFAULT NULL,
  `name` varchar(256) NOT NULL,
  `names` json DEFAULT NULL,
  `manaCost` varchar(64) DEFAULT NULL,
  `cmc` float DEFAULT NULL,
  `colors` json DEFAULT NULL,
  `colorIdentity` json DEFAULT NULL,
  `type` varchar(128) DEFAULT NULL,
  `supertypes` json DEFAULT NULL,
  `types` json DEFAULT NULL,
  `subtypes` json DEFAULT NULL,
  `rarity` varchar(32) DEFAULT NULL,
  `text` varchar(1024) DEFAULT NULL,
  `flavor` varchar(1024) DEFAULT NULL,
  `artist` varchar(128) DEFAULT NULL,
  `number` varchar(16) DEFAULT NULL,
  `power` varchar(8) DEFAULT NULL,
  `toughness` varchar(8) DEFAULT NULL,
  `loyalty` varchar(8) DEFAULT NULL,
  `multiverseid` int(11) DEFAULT NULL,
  `variations` json DEFAULT NULL,
  `imageName` varchar(256) DEFAULT NULL,
  `watermark` varchar(64) DEFAULT NULL,
  `border` varchar(16) DEFAULT NULL,
  `timeshifted` tinyint(1) DEFAULT NULL,
  `hand` int(11) DEFAULT NULL,
  `life` int(11) DEFAULT NULL,
  `reserved` tinyint(1) DEFAULT NULL,
  `releaseDate` datetime DEFAULT NULL,
  `starter` tinyint(1) DEFAULT NULL,
  `rulings` json DEFAULT NULL,
  `foreignNames` json DEFAULT NULL,
  `printings` json DEFAULT NULL,
  `originalText` varchar(1024) DEFAULT NULL,
  `originalType` varchar(128) DEFAULT NULL,
  `legalities` json DEFAULT NULL,
  `source` varchar(1024) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `mtgjson_sets` (
  `code` varchar(8) NOT NULL,
  `name` varchar(128) NOT NULL,
  `gathererCode` varchar(8) DEFAULT NULL,
  `oldCode` varchar(8) DEFAULT NULL,
  `magicCardsInfoCode` varchar(8) DEFAULT NULL,
  `releaseDate` datetime DEFAULT NULL,
  `border` varchar(16) DEFAULT NULL,
  `type` varchar(32) DEFAULT NULL,
  `block` varchar(32) DEFAULT NULL,
  `onlineOnly` tinyint(1) DEFAULT NULL,
  `booster` json DEFAULT NULL,
  PRIMARY KEY (`code`),
  UNIQUE KEY `code_UNIQUE` (`code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `scryfall_cards` (
  `id` varchar(36) NOT NULL,
  `object` varchar(16) DEFAULT NULL,
  `multiverse_id` int(11) DEFAULT NULL,
  `mtgo_id` int(11) DEFAULT NULL,
  `name` varchar(256) NOT NULL,
  `uri` varchar(256) DEFAULT NULL,
  `scryfall_uri` varchar(256) DEFAULT NULL,
  `highres_image` tinyint(1) DEFAULT NULL,
  `image_uri` varchar(256) DEFAULT NULL,
  `image_uris` json DEFAULT NULL,
  `cmc` float DEFAULT NULL,
  `type_line` varchar(256) DEFAULT NULL,
  `card_faces` json DEFAULT NULL,
  `oracle_text` varchar(1024) DEFAULT NULL,
  `mana_cost` varchar(64) DEFAULT NULL,
  `power` varchar(8) DEFAULT NULL,
  `toughness` varchar(8) DEFAULT NULL,
  `loyalty` varchar(8) DEFAULT NULL,
  `colors` json DEFAULT NULL,
  `color_identity` json DEFAULT NULL,
  `layout` varchar(64) DEFAULT NULL,
  `all_parts` json DEFAULT NULL,
  `legalities` json DEFAULT NULL,
  `reserved` tinyint(1) DEFAULT NULL,
  `reprint` tinyint(1) DEFAULT NULL,
  `set` varchar(8) DEFAULT NULL,
  `set_name` varchar(128) DEFAULT NULL,
  `set_uri` varchar(256) DEFAULT NULL,
  `scryfall_set_uri` varchar(256) DEFAULT NULL,
  `collector_number` varchar(45) DEFAULT NULL,
  `digital` tinyint(1) DEFAULT NULL,
  `rarity` varchar(16) DEFAULT NULL,
  `flavor_text` varchar(512) DEFAULT NULL,
  `artist` varchar(64) DEFAULT NULL,
  `frame` varchar(16) DEFAULT NULL,
  `border_color` varchar(16) DEFAULT NULL,
  `timeshifted` tinyint(1) DEFAULT NULL,
  `colorshifted` tinyint(1) DEFAULT NULL,
  `futureshifted` tinyint(1) DEFAULT NULL,
  `story_spotlight_number` int(11) DEFAULT NULL,
  `story_spotlight_uri` varchar(256) DEFAULT NULL,
  `edhrec_rank` int(11) DEFAULT NULL,
  `full_art` tinyint(1) DEFAULT NULL,
  `usd` varchar(45) DEFAULT NULL,
  `eur` varchar(45) DEFAULT NULL,
  `tix` varchar(45) DEFAULT NULL,
  `related_uris` json DEFAULT NULL,
  `purchase_uris` json DEFAULT NULL,
  `watermark` varchar(64) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `scryfall_sets` (
  `code` varchar(8) NOT NULL,
  `mtgo_code` varchar(8) NOT NULL,
  `parent_set_code` varchar(8) DEFAULT NULL,
  `block` varchar(128) DEFAULT NULL,
  `block_code` varchar(8) DEFAULT NULL,
  `name` varchar(128) DEFAULT NULL,
  `released_at` date DEFAULT NULL,
  `set_type` varchar(16) NOT NULL,
  `card_count` smallint(4) NOT NULL,
  `digital` bit(1) not null,
  `foil` bit(1) not null,
  `uri` varchar(128) NOT NULL,
  `scryfall_uri` varchar(128) NOT NULL,
  `icon_svg_uri` varchar(128) NOT NULL,
  `search_uri` varchar(128) NOT NULL,
  PRIMARY KEY (`code`),
  KEY `code_idx` (`parent_set_code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `cards` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `scryfall_id` varchar(36) DEFAULT NULL,
  `mtgjson_id` varchar(64) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `scryfall_id_UNIQUE` (`scryfall_id`),
  UNIQUE KEY `mtgjson_id_UNIQUE` (`mtgjson_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(64) NOT NULL,
  `password` varchar(128) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`),
  UNIQUE KEY `name_UNIQUE` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `collections` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `name` varchar(256) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`),
  KEY `user_id_idx` (`user_id`),
  CONSTRAINT `id` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8mb4;

CREATE TABLE `collection_card` (
  `collection_id` int(11) NOT NULL,
  `card_id` int(11) NOT NULL,
  `normal_qty` int(11) NOT NULL DEFAULT '0',
  `foil_qty` int(11) NOT NULL DEFAULT '0',
  PRIMARY KEY (`collection_id`,`card_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;