"use strict";

var expect = require('chai').expect,
    requestContext = require('../../lib/requestContext');

describe('requestContext', function() {

    before(function(done) {
        var contract = {
            name: 'testContract',
            properties: {
                prop1: {
                    required: true
                },
                prop2: {
                    required: false
                },
                prop3: {
                    required: false
                }
            }
        };
        this.req = {
            authenticatedUser:{someuserid:1},
            headers: {'auth': '1'},
            body: {body:1, prop3:'val3'},
            params: {param1: 1, prop1:'val1'},
            query: {query1: 1, prop2:'val2'}
        };
        this.requestContext = requestContext(contract, this.req);
        done();
    });
    it('should have authenticatedUser if present', function(done){
        expect(this.requestContext.authenticatedUser).to.deep.equal(this.req.authenticatedUser);
        done();
    });

    describe('contract properties', function(){

        it('should get it from params', function(done){
            expect(this.requestContext.prop1).to.equal('val1');
            done();
        });

        it('should should get it from query', function(done){
            expect(this.requestContext.prop2).to.equal('val2');
            done();
        });

        it('should get it from body', function(done){
            expect(this.requestContext.prop3).to.equal('val3');
            done();
        });
    });
    describe('request', function() {

        it('should be present', function(done) {
            expect(this.requestContext.request).to.not.equal(undefined);
            done();
        });

        it('should have headers', function(done) {
            expect(this.requestContext.request.headers).to.deep.equal(this.req.headers);
            done();
        });

        it('should have body', function(done) {
            expect(this.requestContext.request.body).to.deep.equal(this.req.body);
            done();
        });

        it('should have parameters', function(done) {
            expect(this.requestContext.request.parameters).to.deep.equal(this.req.params);
            done();
        });

        it('should should have query', function(done) {
            expect(this.requestContext.request.query).to.deep.equal(this.req.query);
            done();
        });
    });
});