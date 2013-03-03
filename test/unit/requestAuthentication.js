"use strict";

var expect = require('chai').expect,
    httpStatusCodes = require('../../lib/httpStatusCodes'),
    httpResponseSender = require('../../lib/httpResponseSender'),
    requestAuthentication = require('../../lib/requestAuthentication'),
    sinon = require('sinon');

describe('requestAuthentication', function() {

    beforeEach(function(done) {
        this.authDelegate = sinon.stub();
        this.responseSendStub = sinon.stub(httpResponseSender, 'send');
        this.res = sinon.spy();
        this.next = sinon.spy();
        this.authenticator = requestAuthentication(this.authDelegate);
        done();
    });

    afterEach(function(done){
        this.responseSendStub.restore();
        done();
    });

    describe('authorization header', function() {

        describe('is missing', function() {

            it('should call httpResponseSender with 401', function(done) {
                var req = {
                    headers: {}
                };
                this.authenticator(req, this.res, this.next);

                expect(this.responseSendStub.args[0][0]).to.equal(this.res);
                expect(this.responseSendStub.args[0][1]).to.equal(httpStatusCodes.Unauthorized);

                done();
            });
        });

        describe('is present', function() {

            beforeEach(function(done) {
                this.request = {
                    headers: { 'authorization': 'not realz'}
                };
                done();
            });

            describe('authentication delegate', function() {

                it('should be called with the auth header value as first argument', function(done) {
                    this.authenticator(this.request, this.res, this.next);

                    expect(this.authDelegate.calledWith('not realz')).to.be.true;
                    done();
                });

                describe('auth callback', function() {

                    describe('has error', function() {

                        it('should call httpResponseSender with 401', function(done) {
                            this.authDelegate.callsArgWith(1, {someerror:'eee'});
                            this.authenticator(this.request, this.res, this.next);

                            expect(this.responseSendStub.args[0][0]).to.equal(this.res);
                            expect(this.responseSendStub.args[0][1]).to.equal(httpStatusCodes.Unauthorized);
                            expect(this.next.called).to.be.true;

                            done();
                        });
                    });

                    describe('has no error', function() {

                        it('should adds result to response as authenticatedUser', function(done) {
                            this.authDelegate.callsArgWith(1, null, {userid:1});

                            this.authenticator(this.request, this.res, this.next);

                            expect(this.request.authenticatedUser).to.deep.equal({userid:1});
                            expect(this.next.called).to.be.true;

                            done();
                        });
                    });
                });

            });
        });
    });

});