const url = require("url");
const https = require("https");
const qs = require("querystring");

class ServerRequest {

    static Get(uri, query, cb) {
        makeReq("get", uri, query, cb);
    }

    static Post(uri, postData, cb) {
        makeReq("post", uri, postData, cb)
    }

    static Delete(uri, query, cb) {
        makeReq("delete", uri, query, cb);
    }
}

/**
 * Makes a request to the backend.
 */
function makeReq(method, uri, args, cb, _partialData) {
    if (!cb && typeof (args) === "function") {
        cb = args;
    }
    let isPost = method == "post";
    let parsedUri = url.parse(uri);
    let reqOps = {
        method: method,
        host: parsedUri.host,
        path: parsedUri.pathname || "",
        withCredentials: true
    };
    if (isPost) {
        args = qs.stringify(args);
        reqOps.headers = Object.assign(reqOps.headers || {}, {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Content-Length': Buffer.byteLength(args)
        });
    } else {
        reqOps.path = reqOps.path + "?" + qs.stringify(Object.assign(qs.parse(parsedUri.query), args))
    }
    let req = https.request(reqOps, (resp) => {
        let responseData = "";
        resp.on("data", (chunk) => {
            responseData += chunk;
        });
        resp.on("end", () => {
            let jsonData = responseData;
            try {
                jsonData = JSON.parse(responseData);
            } catch (e) {
                console.info(`Unable to convert response to json: '${jsonData}'`);
            }
            if (resp.statusCode >= 400) {
                console.error("Server call error:", resp.statusCode, resp.statusMessage);
            }
            cb(jsonData, resp.statusCode);
        });
    });
    if (isPost) {
        req.write(args);
    }
    req.end();
}

module.exports = ServerRequest;