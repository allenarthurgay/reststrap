"use strict";

var JSV = require("JSV").JSV;

var env = JSV.createEnvironment('json-schema-draft-03');

exports = module.exports = function(contract, model){
    var report = env.validate(model, contract);
    if(report.errors.length > 0){
        return report.errors;
    }
    return undefined;
};