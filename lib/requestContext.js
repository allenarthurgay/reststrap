"use strict";

var assert = require("assert");

module.exports = function(req){
    assert(typeof req.headers != 'undefined', "must provide a headers collection value");
    assert(typeof req.params != 'undefined', "must provide a params collection value");

    return {
        request:{
            headers : req.headers,
            body : req.body,
            parameters: req.params,
            query: req.query
        }
    };
};