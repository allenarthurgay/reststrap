"use strict";

var requestAuthenticationFactory = require("./requestAuthenticationFactory");

function routeHasRequirement(route, requirement) {
    return route.requirements[requirement] == true;
};

exports.create = function(route) {
    var isSecure = routeHasRequirement(route, "secure");
    if (isSecure) {
        return [requestAuthenticationFactory.create(route.authenticator)];
    }
    return [];
};

