"use strict";

var assert = require("assert");

var getHeader = function(headerName, headers){
    for(var i=0; i < headers.length; i++){
        var header = headers[i];
        if(header.name == headerName){
            return header;
        }
    }
    return undefined;
};

var getAuthenticationHeader = function(request){
    assert(typeof request.headers != 'undefined', "must provide a headers collection value");
    return getHeader("Authentication", request.headers);
};

var parseKeyFromHeader = function(header){
    return "";
};

module.exports = function(authType, authentication){
    {
        return function(context, callback){
            var header = getAuthenticationHeader(context.request);
            var key = parseKeyFromHeader(authType, header);
            authentication(key, callback);
        }
    }
};