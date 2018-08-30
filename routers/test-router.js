const debug = require("debug")("server/api");
const express = require("express");
const React = require("react");
const ReactDOMServer = require("react-dom/server");
const { knex } = require("../data/db-conn");
const soap = require("soap");

const send = require("./static-router");
const router = express.Router();

router.get("/", async (req, resp) => {

    soap.createClient("https://api.mindbodyonline.com/0_5/ClassService.asmx?WSDL", (err, client) => {
        if (err) {
            throw new Error("Unable to connect to Mindbody client.");
        }
        resp.json(Object.keys(client).filter((key) => key[0] !== "_" && key[0] === key[0].toUpperCase()));
        /*
        client.GetClassSchedules(params, (err, result) => {
            if (err) {
                throw new Error("Call failed: " + err);
            }
        });*/
    });

    const params = {
        Request: {
            SourceCredentials: {
                SourceName: "WBB",
                Password: "51jvoPV1LkLhhrVzar2Ovdewv7Q=",
                SiteIDs: {
                    int: -99
                }
            },
            UserCredentials: {
                Username: "Siteowner",
                Password: "apitest1234",
                SiteIDs: {
                    int: -99
                }
            }
        }
    }
});

module.exports = router;