"use strict";

var restify = require("restify"),
    registration = require("./routeRegistration"),
    log = require("winston");

var buildRoute = function (verb, url, contract, handler, authenticated) {
    return {
        method:verb,
        url:url,
        handler:handler,
        requirements:{
            secure:authenticated
        },
        contract:contract
    };
};

var RestStrapServer = exports.RestStrapServer = function (logFactory) {
    this.routes = [];
    this.logFactory = logFactory;
    this.logger = this.logFactory.create(__filename);
};


RestStrapServer.prototype.useAuthenticator = function (func) {
    this.authenticator = func;
};

RestStrapServer.prototype.handleRoute = function (verb, url, contract, handler) {
    this.routes.push(buildRoute(verb, url, contract, handler, false));
    return this;
};

RestStrapServer.prototype.handleRouteAuthenticated = function (verb, url, contract, handler) {
    this.routes.push(buildRoute(verb, url, contract, handler, true));
    return this;
};

RestStrapServer.prototype.start = function (port) {
    var server = restify.createServer(),
        self = this;
    server.use(restify.acceptParser(server.acceptable));
    server.use(restify.bodyParser());
    server.get('/__meta', function (req, res, next) {
        res.json(self.routes);
    });

    this.routes.forEach(function (route) {
        if (route.requirements.secure) {
            route.authenticator = self.authenticator;
        }
        registration.registerRoute(server, route, self.logFactory);
    });

    server.listen(port, function () {
        self.logger.info('%s listening at %s', server.name, server.url);
    });
};



