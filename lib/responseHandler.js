"use strict";
var httpStatusCodes = require("./httpStatusCodes"),
    response = require("./httpResponseSender");

exports = module.exports = function(err, doc, res) {
    if (err) {
        if (err.unauthorized) {
            response.send(res, httpStatusCodes.Unauthorized, err);
        }
        else {
            response.send(res, httpStatusCodes.Error, err);
        }
    }
    else {
        response.send(res, httpStatusCodes.Ok, doc);
    }
};
