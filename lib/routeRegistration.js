"use strict";

var log = require("./utils/logger"),
    requestContext = require("./requestContext"),
    httpMethods = require("./httpMethods"),
    httpStatusCodes = require("./httpStatusCodes"),
    requestAuthentication = require("./requestAuthentication"),
    response = require("./httpResponseSender"),
    introspect = require("introspect");

var responseHandler = function(err, doc, res){
    if(err){
        if(err.unauthorized){
            response.send(res, httpStatusCodes.Unauthorized, err);
        }
        else{
            response.send(res, httpStatusCodes.Error, err);
        }
    }
    else{
        response.send(res, httpStatusCodes.Ok, doc);
    }
};

var registerSecureHandler = function(route, authenticator){
    var handler = route.handler;

    return function(req, res, next){
        var context =  requestContext(route.requestContract, req);
        try{
            authenticator(context, function(err, user){
                handler(context, function(err, doc){
                    responseHandler(err, doc, res);
                });
            });
        }
        catch(err){
            dumpError(err);
            response.send(res, httpStatusCodes.Error, err);
        }
    } ;
};

var registerHandler = function(route){
    var handler = route.handler;

    return function(req, res, next){
        var context =  requestContext(route.requestContract,req);

        try{
            handler(context, function(err, doc){
                responseHandler(err, doc, res);
            });
        }
        catch(err){
            dumpError(err);
            response.send(res, httpStatusCodes.Error, err);
        }
    } ;
};

var assignHandlerToMethod = function(server, route, handler){
    log.info("registering route %j", route);
    if(route.method == httpMethods.Post){
        server.post(route.url, handler);
    }
    else if(route.method == httpMethods.Get){
        server.get(route.url, handler);
    }
};

var findHandlerForRoute = function(route, authenticator){
    var isSecure =  hasRequirement(route, "secure");
    var handler = undefined;

    if(isSecure){
        handler = registerSecureHandler(route, authenticator);
    }
    else{
        handler = registerHandler(route);
    }
    return handler;
};

var registerRoutes = function(server, routes, authentication){
    var authenticator = requestAuthentication("GMS", authentication);
    for(var i=0; i < routes.length; i++){
        var route = routes[i];
        var handler = findHandlerForRoute(route, authenticator);
        assignHandlerToMethod(server, route, handler);
    }
};

var hasRequirement  = function(route, requirement){
    return route.requirements[requirement] == true;
}

function dumpError(err) {
    if (typeof err === 'object') {
        if (err.message) {
            log.error('\nMessage: ' + err.message)
        }
        if (err.stack) {
            log.error('\nStacktrace:')
            log.error('====================')
            log.error(err.stack);
        }
    } else {
        log.error('dumpError :: argument is not an object');
    }
}

module.exports = registerRoutes;