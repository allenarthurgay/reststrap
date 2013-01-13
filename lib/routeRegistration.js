"use strict";

var log = require("./utils/logger"),
    requestContext = require("./requestContext"),
    httpStatusCodes = require("./httpStatusCodes"),
    requestAuthentication = require("./requestAuthentication"),
    response = require("./httpResponseSender");

var createRouteRequestHandler = function(route){
    return function(req, res, next){
        var context =  requestContext(route.contract, req);

        try{
            route.handler(context, function(err, doc){
                responseHandler(err, doc, res);
            });
        }
        catch(err){
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
            response.send(res, httpStatusCodes.Error, err);
        }
    } ;
};

var findMiddleware = function(route){
    var isSecure =  hasRequirement(route, "secure");
    if(isSecure){
        return [requestAuthentication(route.authenticator)];
    }
    return [];
};

var hasRequirement  = function(route, requirement){
    return route.requirements[requirement] == true;
} ;

var registerRoute = function(server, route){
    var handler = createRouteRequestHandler(route);
    var verb = route.method.toLowerCase();
    var url = route.url;
    var mid = findMiddleware(route);

    server[verb](url, mid, handler);
};

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

exports.registerRoute = registerRoute;