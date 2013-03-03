"use strict";

var expect = require('chai').expect,
    httpStatusCodes = require('../../lib/httpStatusCodes');

describe('httpStatusCodes', function() {

    it('should be 200 for Ok', function(done) {
        expect(httpStatusCodes.Ok).to.equal(200);
        done();
    });

    it('should be 404 for NotFound', function(done) {
        expect(httpStatusCodes.NotFound).to.equal(404);
        done();
    });

    it('should be 400 for BadRequest', function(done) {
        expect(httpStatusCodes.BadRequest).to.equal(400);
        done();
    });

    it('should be 401 for Ok', function(done) {
        expect(httpStatusCodes.Unauthorized).to.equal(401);
        done();
    });

    it('should be 500 for Error', function(done) {
        expect(httpStatusCodes.Error).to.equal(500);
        done();
    });

});