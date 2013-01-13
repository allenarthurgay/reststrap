"use strict";

var restify = require("restify"),
    registration = require("./routeRegistration"),
    log = require("./utils/logger");

var RestStrapServer = function(port){
    var self = this;
    var routes = [];
    var server = restify.createServer();
    server.use(restify.acceptParser(server.acceptable));
    server.use(restify.bodyParser());

    var buildRoute = function(verb, url, contract, handler, authenticated) {
        return {
            method:verb,
            url: url,
            handler: handler,
            requirements:{
                secure:authenticated
            },
            contract: contract
        };
    };

    self.useAuthenticator= function(func){
        self.authenticator = func;
    };

    self.handleRoute = function(verb, url, contract, handler){
        routes.push(buildRoute(verb, url, contract, handler, false));
        return self;
    };

    self.handleRouteAuthenticated = function(verb, url, contract, handler){
        routes.push(buildRoute(verb, url, contract, handler, true));
        return self;
    };

    self.listen = function(){
        routes.forEach(function(route){
            if(route.requirements.secure){
                route.authenticator = self.authenticator;
            }
            registration.registerRoute(server, route);
        });

        server.listen.apply(this, arguments);
    };
};

exports.server = new RestStrapServer();

