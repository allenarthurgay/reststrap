"use strict";

var expect = require('chai').expect,
    responseHandlerFactory = require('../../lib/responseHandlerFactory'),
    response = require('../../lib/httpResponseSender'),
    sinon = require('sinon');

describe('responseHandler', function(){

    beforeEach(function(done){
        this.responseSendStub = sinon.stub(response, 'send');
        this.result = sinon.spy();
        this.response = sinon.spy();
        this.loggerStub = sinon.spy();

        this.responseHandler = responseHandlerFactory.create(this.loggerStub);
        done();
    });

    afterEach(function(done){
        this.responseSendStub.restore();
        done();
    });

    describe('when passed an err', function(){

        describe('if unauthorized', function(){

            it('should send 401 with err', function(done){
                this.responseHandler({unauthorized:true}, this.result, this.response);
                expect(this.responseSendStub.args[0][0]).to.deep.equal(this.response);
                expect(this.responseSendStub.args[0][1]).to.equal(401);
                expect(this.responseSendStub.args[0][2]).to.deep.equal({unauthorized:true});
                done();
            });
        });

        describe('if not unauthorized', function(){

            it('should send 500 and error', function(done){
                this.responseHandler({}, this.result, this.response);
                expect(this.responseSendStub.args[0][0]).to.deep.equal(this.response);
                expect(this.responseSendStub.args[0][1]).to.equal(500);
                expect(this.responseSendStub.args[0][2]).to.deep.equal({});
                done();
            });
        });
    });

    describe('when no error', function(){

        it('should send 200 with result', function(done){
            this.responseHandler(null, this.result, this.response);
            expect(this.responseSendStub.args[0][0]).to.deep.equal(this.response);
            expect(this.responseSendStub.args[0][1]).to.equal(200);
            expect(this.responseSendStub.args[0][2]).to.deep.equal(this.result);
            done();
        });
    });
});