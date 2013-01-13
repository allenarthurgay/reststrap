"use strict";

var assert = require("assert"),
    async = require("async");

var getHeader = function(headerName, headers){
    headerName=headerName.toLowerCase();
    for(var header in headers){
        if(header.toLowerCase() == headerName){
            return headers[header];
        }
    }
    return undefined;
};

var getAuthenticationHeader = function(request){
    assert(typeof request.headers != 'undefined', "must provide a headers collection value");
    return getHeader("authorization", request.headers);
};

module.exports = function(authentication){
    {
        return function(req, res, next){
            var authenticationKey = getAuthenticationHeader(req);
            if(authenticationKey == undefined){
                res.send(401,"Can't find authorization header");
                return;
            }
            authentication(authenticationKey, function(err, result){
                if(err){
                    res.send(401,"Can't auth");
                    next();
                    return;
                }
                next();
            });
        }
    }
};