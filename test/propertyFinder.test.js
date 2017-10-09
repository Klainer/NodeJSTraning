'use strict';

process.env.NODE_ENV = 'test'; //During the test the env variable is set to test

const chai = require('chai');
const propertyFinder = require('../lib/jsonPropertyFinder');

describe('Property Finder', function () {
    
        let propertyToFindName = 'count';
    
        var a = { name: 'martin', surename: 'hascak', count: '3' };
        var b = { name: 'martin', surename: 'petrik', address: { town: 'banov', count: 3 } };
        var c = { name: 'martin', surename: 'hascak' };
    
        let validJsonStringA = JSON.stringify(a);
        let validJsonStringB = JSON.stringify(b);
        let validJsonStringC = JSON.stringify(c);
        let notValidJsonString = '"{"name":"martin","surename":"petrik", address":{"town":"banov","count":3}}"';
    
        it('Will find property: "' + propertyToFindName + '"  in valid JSON', function () {
            let propertyExist = propertyFinder(validJsonStringA, propertyToFindName);
            chai.expect(propertyExist).to.be.true;
        });
    
        it('Will find property: "' + propertyToFindName + '" in inner object in valid JSON', function (done) {
            let propertyExist = propertyFinder(validJsonStringB, propertyToFindName);
            chai.expect(propertyExist).to.be.true;
            done();
        });
    
        it('Will not find property: "' + propertyToFindName + '" valid JSON', function (done) {
            let propertyExist = propertyFinder(validJsonStringC, propertyToFindName);
            chai.expect(propertyExist).to.be.false;
            done();
        });
    
        it('Will not find property: "' + propertyToFindName + '" in invalid JSON', function (done) {
            let propertyExist = propertyFinder(notValidJsonString, propertyToFindName);
            chai.expect(propertyExist).to.be.false;
            done();
        });
    
    });