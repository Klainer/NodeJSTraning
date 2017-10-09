'use strict';

process.env.NODE_ENV = 'test'; //During the test the env variable is set to test

const chai = require('chai');
const chaiHttp = require('chai-http');

const { httpServer } = require('../server').server;

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