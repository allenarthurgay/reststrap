"use strict";

var assert = require("assert");

var findParam = function(contractItem, req){
    var contractVal = req.params[contractItem];
    return contractVal;
};

module.exports = function(contract, req){
    assert(typeof req.headers != 'undefined', "must provide a headers collection value");
    assert(typeof req.params != 'undefined', "must provide a params collection value");

    var data = {
        request:{
            headers : req.headers,
            body : req.body,
            parameters: req.params,
            query: req.query
        }
    };

    for(var contractItem in contract){
        var contractVal = findParam(contractItem, req);
        if(contractVal == undefined && contractItem.required){
            assert(typeof contractVal != 'undefined', "must provide a value for " + contractItem);
        }
        data[contractItem] = contractVal;
    }
    return data;
};

