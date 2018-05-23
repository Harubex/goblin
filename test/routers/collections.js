const request = require("supertest");
const app = require("../../app");

const route = "collections";

describe(route, () => {
    const root = "/";
    test(root, async () => {
        const resp = await request(app).get("/" + route + root);
        expect(resp.status).toBe(302);
    });
});