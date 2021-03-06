"use strict";

var assert = require("assert"),
    async = require("async"),
    httpStatusCodes = require('./httpStatusCodes'),
    httpResponseSender = require('./httpResponseSender');

var getHeader = function(headerName, headers) {
    headerName = headerName.toLowerCase();
    for (var header in headers) {
        if (header.toLowerCase() == headerName) {
            return headers[header];
        }
    }
    return undefined;
};

var getAuthenticationHeader = function(request) {
    assert(typeof request.headers != 'undefined', "must provide a headers collection value");
    return getHeader("authorization", request.headers);
};

exports.create = function(authentication) {
    {
        return function(req, res, next) {
            var authenticationKey = getAuthenticationHeader(req);
            if (authenticationKey == undefined) {
                httpResponseSender.send(res, httpStatusCodes.Unauthorized);
                return;
            }
            authentication(authenticationKey, function(err, result) {
                if (err) {
                    httpResponseSender.send(res, httpStatusCodes.Unauthorized);
                    next(err);
                }
                else {
                    req.authenticatedUser = result;
                    next();
                }
            });
        }
    }
};