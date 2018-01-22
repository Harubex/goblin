import "whatwg-fetch";
/**
 * @param {string} path
 * @param {"get" | "post" | "delete" | "put"} method
 * @param {Object} body
 * @param {(err: any, json: Object) => void} cb
 */
export default async function(path, method, body, cb = () => {}) {
    let options = {
        method: method.toUpperCase(),
        credentials: "include",
        headers: {
            "Content-Type": "application/json"
        }
    };
    if (typeof (body) === "function") {
        cb = body;
    } else if (body) {
        options.body = JSON.stringify(body);
    }
    try {
        let resp = await fetch(new Request(path, options));
        let json = await resp.json();
        if (resp.ok) {
            cb(null, json);
        } else {
            cb(json);
        }
    } catch (err) {
        cb(err);
    }
};
