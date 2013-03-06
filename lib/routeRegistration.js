"use strict";

var log = require('winston'),
    routeRequestHandlerFactory = require('./routeRequestHandlerFactory'),
    requiredMiddlewareFactory = require('./requiredMiddlewareFactory');

exports.registerRoute = function(server, route) {
    var handler = routeRequestHandlerFactory.create(route);
    var verb = route.method.toLowerCase();
    var url = route.url;
    var mid = requiredMiddlewareFactory.create(route);
    log.info("register route", route);
    server[verb](url, mid, handler);
};;