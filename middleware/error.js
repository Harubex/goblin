const debug = require("debug")("server/error");

/**
 * @param {Error} err 
 * @param {Request} req 
 * @param {Response} resp 
 * @param {NextFunction} next 
 */
module.exports = (err, req, resp, next) => {
    debug(err);
    resp.status(err.status || 500).send({
        message: err.message,
        error: process.env.NODE_ENV === "production" ? {} : err
    });
};