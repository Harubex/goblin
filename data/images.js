const https = require("https");
const path = require("path");
const fs = require("fs");
const scryfall = require("scryfall");
const jimp = require("jimp");

const cardImgDir = "./static/cards";

/*fs.rmdir(cardImgDir, (err) => {
    fs.mkdir(cardImgDir, (err) => {
        getScryfallCardPage(1, (cards) => {
            console.log(cards.length + " cards processed.");
        });
    });
});*/

function saveImages(cards, cb, idx = 0) {
    if (cards[idx]) {
        let imgUrl = "";
        let flipCard = false;
        if (cards[idx].card_faces && !cards[idx].image_uris) {
            flipCard = true;
            imgUrl = cards[idx].card_faces[0].image_uris.png;
        } else {
            imgUrl = cards[idx].image_uris.png;
        }
        saveImage(cards[idx], imgUrl, cards[idx].set, cards[idx].collector_number, () => {
            console.log(cards[idx].name);
            setTimeout(() => {
                if (flipCard) {
                    saveImage(cards[idx], cards[idx].card_faces[1].image_uris.png, cards[idx].set, cards[idx].collector_number, () => {
                        saveImages(cards, cb, idx + 1);
                    });
                } else {
                    saveImages(cards, cb, idx + 1);
                }
            }, 500);
        });
    } else {
        cb();
    }
}

function saveImage(card, url, set, code, cb) {
    jimp.read(url, (err, img) => {
        if (err || !img) {
            console.log("An error occurred, restarting: " + (err || {message: "No image available"}).message);
            setTimeout(() => {
                saveImage(card, card.card_faces ? url : card.image_uris.normal, set, code, cb);
            }, 10000);
        } else {
            img.write(path.join(cardImgDir, set, code + ".png"), (err) => {
                cb();
            });
        }
    });
}


function getScryfallCardPage(page, cb, _data = []) {
    scryfall.getAllCards(page, (cards) => {
        if (Array.isArray(cards) && cards.length > 0) {
            saveImages(cards, () => {
                getScryfallCardPage(page + 1, cb, _data.concat(cards));
            });
        } else {
            cb(_data);
        }
    });
}

exports.saveImage = saveImage;