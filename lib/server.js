"use strict";

var restify = require("restify"),
    express = require("express"),
    http = require('http'),
    registration = require("./routeRegistration");


function buildRoute(parameters) {
    var verb = parameters.verb,
        url = parameters.url,
        contract = parameters.contract,
        handler = parameters.handler,
        authenticated = parameters.authenticated;

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

var errorChecks = [
    {
        check: function(func){
            return !func;
        },
        message:'the authenticator registered is undefined'
    },
    {
        check: function(func){
            return typeof func != 'function';
        },
        message:'you must use a function for the authenticator'
    }  ,
    {
        check: function(func){
            return func.length != 2;
        },
        message:'the authenticator registered must be a function with an arity of 2'
    }
];

RestStrapServer.prototype.useAuthenticator = function (func) {
    var errorCheck,
        i;

    for(i=0 ;i < errorChecks.length; i++){
        errorCheck = errorChecks[i];
        if(errorCheck.check(func)){
            self.logger.error(errorCheck.message);
            throw new Error(errorCheck.message);
        }
    }

    this.authenticator = func;
};

RestStrapServer.prototype.handleRoute = function (verb, url, contract, handler) {
    this.routes.push(buildRoute({verb: verb, url: url, contract: contract, handler: handler, authenticated: false}));
    return this;
};

RestStrapServer.prototype.handleRouteAuthenticated = function (verb, url, contract, handler) {
    this.routes.push(buildRoute({verb: verb, url: url, contract: contract, handler: handler, authenticated: true}));
    return this;
};

RestStrapServer.prototype.start = function (port) {
    var app = express(),
        self = this;

    app.configure('all', function(){

        app.set('port', process.env.PORT || port);

        app.use(express.bodyParser());

        // Allows delete and put verbs to be simulated via POST and queryString param of _method=delete/put.
        app.use(express.methodOverride());

        // Process routes before static content
        app.use(app.router);
    });

    app.get('/__meta', function (req, res, next) {
        res.json(self.routes);
    });

    this.routes.forEach(function (route) {
        if (route.requirements.secure) {
            route.authenticator = self.authenticator;
        }
        registration.registerRoute(app, route, self.logFactory);
    });

    http.createServer(app).listen(app.get('port'), function() {
        self.logger.info('restrap server listening on port %s', app.get('port'));

    });
};