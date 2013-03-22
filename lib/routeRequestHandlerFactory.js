"use strict";

var requestContext = require('./requestContext'),
    requestModelValidator = require('./requestModelValidator'),
    httpStatusCodes = require('./httpStatusCodes'),
    responseHandler = require('./responseHandler'),
    response = require('./httpResponseSender');

exports.create = function(route, logFactory) {
    return function(req, res, next) {
        var logger = logFactory.create(req.url),
            context = requestContext(route.contract, req),
            validationErrors = requestModelValidator(route.contract, context),
            handler = responseHandler.create(logger);
        if (validationErrors) {
            var error = {
                url: req.url,
                contract: route.contract,
                context: context,
                errors: validationErrors
            };
            logger.error('sending validation error : %j', error);
            response.send(res, httpStatusCodes.BadRequest, error);
            return;
        }
        try {
            route.handler(context, function(err, doc) {
                handler(err, doc, res);
            });
        }
        catch (err) {
            if (typeof err === 'object') {
                if (err.message) {
                    logger.error('\nMessage: ' + err.message)
                }
                if (err.stack) {
                    logger.error('\nStacktrace:')
                    logger.error('====================')
                    logger.error(err.stack);
                }
            }
            else {
                logger.error('dumpError :: argument is not an object');
            }
            response.send(res, httpStatusCodes.Error, err);
        }
    };
};