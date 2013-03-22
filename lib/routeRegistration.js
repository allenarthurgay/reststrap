"use strict";

var routeRequestHandlerFactory = require('./routeRequestHandlerFactory'),
    requiredMiddlewareFactory = require('./requiredMiddlewareFactory');

exports.registerRoute = function(server, route, logFactory) {
    var logger = logFactory.create(__filename);
    var handler = routeRequestHandlerFactory.create(route, logFactory);
    var verb = route.method.toLowerCase();
    var url = route.url;
    var mid = requiredMiddlewareFactory.create(route);
    logger.info("register route", route);
    server[verb](url, mid, handler);
};;