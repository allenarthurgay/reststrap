"use strict";

var expect = require('chai').expect,
    httpMethods = require('../../lib/httpMethods');

describe('httpMethods', function(){

    it('should have POST', function(done){
        expect(httpMethods.Post).to.equal('POST');
        done();
    });

    it('should have GET', function(done){
        expect(httpMethods.Get).to.equal('GET');
        done();
    });
});