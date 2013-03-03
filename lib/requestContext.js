"use strict";

var assert = require("assert");

var findParam = function(contractItem, req) {
    var contractVal = req.params[contractItem] || req.query[contractItem] || req.body[contractItem];
    return contractVal;
};

exports = module.exports = function(contract, req) {
    assert(typeof req.headers != 'undefined', "must provide a headers collection value");
    assert(typeof req.params != 'undefined', "must provide a params collection value");

    var data = {
        request: {
            headers: req.headers,
            body: req.body,
            parameters: req.params,
            query: req.query
        }
    };

    for (var contractItem in contract.properties) {
        var contractVal = findParam(contractItem, req);
        if (contractVal !== undefined) {
            data[contractItem] = contractVal;
        }
    }
    data.authenticatedUser = req.authenticatedUser;
    return data;
};

