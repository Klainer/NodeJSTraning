'use strict';

process.env.NODE_ENV = 'test'; //During the test the env variable is set to test

const chai = require('chai');
const { redisClient } = require('../server/server.js');

describe('REDIS', function () {
    describe('Status', function () {
        it('Is connected', function () {
            chai.expect(redisClient.connected).to.be.true;
        });
    });
});
