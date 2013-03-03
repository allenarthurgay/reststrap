"use strict";

var expect = require('chai').expect,
    httpResponseSender = require('../../lib/httpResponseSender'),
    sinon = require('sinon');

describe('httpResponseSender', function() {

    beforeEach(function(done) {
        this.res = {
            json: sinon.spy(),
            end: sinon.spy()
        };
        done();
    });

    it('should send status code', function(done) {
        httpResponseSender.send(this.res, 200);
        expect(this.res.json.args[0][0]).to.equal(200);
        done();
    });

    it('should send body', function(done) {
        httpResponseSender.send(this.res, 200, {title: 'me'});
        expect(this.res.json.args[0][1]).to.deep.equal({title: 'me'});
        done();
    });

    it('should end response', function(done) {
        httpResponseSender.send(this.res, 200, {title: 'me'});
        expect(this.res.end.called).to.be.true;
        done();
    });

});