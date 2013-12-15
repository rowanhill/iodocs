var sinon = require('sinon'),
    should = require('should');

var redis = require('redis'),
    url = require('url');

var redisSetup = require('../src/redisSetup.js');

describe('Redis setup', function() {
    var sandbox = sinon.sandbox.create();

    var fakeClient = {
        auth: function() {},
        on: function() {}
    };

    afterEach(function() {
        sandbox.restore();
    });

    it('defaults the configured database to 0', function() {
        // given
        var config = {};

        // when
        redisSetup.configure(config);

        // then
        config.should.have.property('database', '0');
    });

    it('respects a previously configured database property', function() {
        // given
        var config = {database: '1'};

        // when
        redisSetup.configure(config);

        // then
        config.should.have.property('database', '1');
    });

    it('returns a Redis client created from config', function() {
        // given
        var config = {
            port: 12345,
            host: 'some-host',
            password: 'its-a-secret'
        };
        sandbox.stub(redis, 'createClient').withArgs(config.port, config.host).returns(fakeClient);
        var authSpy = sandbox.spy(fakeClient, 'auth');

        // when
        var client = redisSetup.configure(config);

        // then
        client.should.eql(fakeClient);
        authSpy.calledWith(config.password).should.be.ok;
    });

    it('overrides config values with Redis To Go values if available', function() {
        // given
        var config = {
            port: 12345,
            host: 'some-host',
            password: 'its-a-secret'
        };
        process.env.REDISTOGO_URL = 'some-url';
        var redisToGoConfigPassword = 'another-password';
        var redisToGoConfig = {
            hostname: 'another-host',
            port: 54321,
            auth: 'user:' + redisToGoConfigPassword
        };
        sandbox.stub(url, 'parse').withArgs(process.env.REDISTOGO_URL).returns(redisToGoConfig);

        // when
        redisSetup.configure(config);

        // then
        config.should.have.property('port', redisToGoConfig.port);
        config.should.have.property('host', redisToGoConfig.hostname);
        config.should.have.property('password', redisToGoConfigPassword);
    });

    it('returns a Redis client created from Redit To Go values if available', function() {
        // given
        var config = {
            port: 12345,
            host: 'some-host',
            password: 'its-a-secret'
        };
        process.env.REDISTOGO_URL = 'some-url';
        var redisToGoConfigPassword = 'another-password';
        var redisToGoConfig = {
            hostname: 'another-host',
            port: 54321,
            auth: 'user:' + redisToGoConfigPassword
        };
        sandbox.stub(url, 'parse').withArgs(process.env.REDISTOGO_URL).returns(redisToGoConfig);
        sandbox.stub(redis, 'createClient').withArgs(redisToGoConfig.port, redisToGoConfig.hostname).returns(fakeClient);
        var authSpy = sandbox.spy(fakeClient, 'auth');

        // when
        var client = redisSetup.configure(config);

        // then
        client.should.eql(fakeClient);
        authSpy.calledWith(redisToGoConfigPassword).should.be.ok;
    });
});