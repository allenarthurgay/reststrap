"use strict";

module.exports = {
    send: function (res, statusCode, body) {
        res.json(statusCode, body);
        res.end();
    }
}