"use strict";

var assert = require("assert");

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

module.exports = function(authType, authentication){
    {
        return function(context, callback){
            var authenticationKey = getAuthenticationHeader(context.request);
            if(authenticationKey == undefined){
                callback({
                    message:"Can't find authorization header",
                    unauthorized:true
                });
                return;
            }
            authentication(authenticationKey, callback);
        }
    }
};