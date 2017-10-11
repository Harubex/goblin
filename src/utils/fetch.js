import "whatwg-fetch";
/**
 * @param {string} path
 * @param {"get" | "post" | "delete" | "put"} method
 * @param {Object} body
 * @param {(err: any, json: Object) => void} cb
 */
export default function(path, method, body, cb = () => {}) {
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
    fetch(new Request(path, options)).then((resp) => resp.json()).then((json) => {
        cb(null, json);
    }).catch((err) => {
        cb(err);
    });
};
