"use strict";

var expect = require('chai').expect,
    requiredMiddlewareFactory = require('../../lib/requiredMiddlewareFactory'),
    requestAuthentication = require("../../lib/requestAuthenticationFactory"),
    sinon = require('sinon');

describe('requiredMiddlewareFactory', function() {

    before(function(done) {
        this.returnedAuth = {fake:1};
        this.requestAuthenticationStub = sinon.stub(requestAuthentication, 'create');
        this.requestAuthenticationStub.returns(this.returnedAuth);
        done();
    });

    after(function(done) {
        this.requestAuthenticationStub.restore();
        done();
    });

    describe('route', function() {

        describe('does not require auth', function() {

            it('should return empty array', function(done) {
                var route = {
                        requirements: { }
                    },
                    result = requiredMiddlewareFactory.create(route);

                expect(result).to.deep.equal([]);
                done();
            });
        });

        describe('requires auth', function() {

            it('should return requestAuthentication with authenticator', function(done) {
                var route = {
                        requirements: { secure: true },
                        authenticator: function(){}
                    },
                    result = requiredMiddlewareFactory.create(route);
                expect(this.requestAuthenticationStub.calledWith(route.authenticator)).to.be.true;
                expect(result).to.deep.equal([this.returnedAuth]);
                done();
            });
        });
    });

});