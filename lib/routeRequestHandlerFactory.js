"use strict";

var log = require('winston'),
    requestContext = require('./requestContext'),
    requestModelValidator = require('./requestModelValidator'),
    httpStatusCodes = require('./httpStatusCodes'),
    responseHandler = require('./responseHandler'),
    response = require('./httpResponseSender');

exports.create = function(route) {
    return function(req, res, next) {
        var context = requestContext(route.contract, req);
        var validationErrors = requestModelValidator(route.contract, context);
        if (validationErrors) {
            response.send(res, httpStatusCodes.BadRequest, validationErrors);
            return;
        }
        try {
            route.handler(context, function(err, doc) {
                responseHandler(err, doc, res);
            });
        }
        catch (err) {
            if (typeof err === 'object') {
                if (err.message) {
                    log.error('\nMessage: ' + err.message)
                }
                if (err.stack) {
                    log.error('\nStacktrace:')
                    log.error('====================')
                    log.error(err.stack);
                }
            }
            else {
                log.error('dumpError :: argument is not an object');
            }
            response.send(res, httpStatusCodes.Error, err);
        }
    };
};