"use strict";

var restify = require("restify"),
    registration = require("./routeRegistration"),
    log = require("./utils/logger"),
    assert = require("assert");

var startServer = function(routes, options){
    assert(typeof options.port != 'undefined', "must provide a port value");
    var server = restify.createServer();
    server.use(restify.acceptParser(server.acceptable));
    server.use(restify.bodyParser());

    registration(server, routes, options.authentication);

    server.listen(options.port, function() {
        log.info('%s listening at %s', server.name, server.url);
    });
};

module.exports = {
    start :startServer
};

