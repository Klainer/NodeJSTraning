'use strict';

process.env.NODE_ENV = 'test'; //During the test the env variable is set to test

const chai = require('chai');
const chaiHttp = require('chai-http');

const { httpServer, redisClient } = require('../server').server;
const propertyFinder = require('../lib/jsonPropertyFinder');

chai.use(chaiHttp);

describe('HTTP Server - integration test', function () {
    describe('POST /track', function () {

        var data = { password: '123', confirmPassword: '123' };
        var jsonData = JSON.stringify(data);

        it('Should return status 200', function (done) {
            chai.request(httpServer)
                .post('/track')
                .send(jsonData)
                .set('content-type', 'application/json')
                .end((err, res) => {
                    chai.expect(err).to.be.null;
                    chai.expect(res.statusCode).to.equal(200);
                    done();
                });
        });
    });

    describe('GET /track', function () {
        it('Should return status 200', function (done) {
            chai.request(httpServer)
                .get('/track')
                .end((err, res) => {
                    chai.expect(err).to.be.null;
                    chai.expect(res.statusCode).to.equal(200);
                    done();
                });
        });
    });

    describe('GET /count', function () {
        it('Should return status 200', function (done) {
            chai.request(httpServer)
                .get('/count')
                .end((err, res) => {
                    chai.expect(err).to.be.null;
                    chai.expect(res.statusCode).to.equal(200);
                    done();
                });
        });

        it('Should return status 404', function (done) {
            chai.request(httpServer)
                .get('/countABCD')
                .end((err, res) => {
                    chai.expect(err).not.be.null;
                    chai.expect(res.statusCode).to.equal(404);
                    done();
                });
        });
    });
});

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


describe('REDIS', function () {
    describe('Status', function () {
        it('Is connected', function () {
            chai.expect(redisClient.connected).to.be.true;
        });

        it('Is disconected', function (done) {
            redisClient.end(true);
            chai.expect(redisClient.connected).to.be.false;
            done();
        });
    });
});
