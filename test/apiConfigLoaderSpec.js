var sinon = require('sinon'),
    should = require('should');

var fs = require('fs'),
    path = require('path'),
    jsonLoader = require('../src/jsonLoader.js');

var apiConfigLoader = require('../src/apiConfigLoader.js');

describe("API config loader", function() {
    var sandbox = sinon.sandbox.create();
    var mockApiConfig = {_name: 'mock API config'};

    function givenPathResolves(dirPath) {
        sandbox.stub(path, 'resolve').withArgs(dirPath).returns('/some/resolved/path');
    }

    beforeEach(function() {
        sandbox.stub(fs, 'existsSync').withArgs('/some/resolved/path').returns(true);
        sandbox.stub(path, 'join').withArgs('/some/resolved/path', 'apiconfig.json').returns('/some/resolved/path/someConfig.json');
        sandbox.stub(jsonLoader, 'load').withArgs('/some/resolved/path/someConfig.json').returns(mockApiConfig)
    });

    afterEach(function() {
        sandbox.restore();
    });

    it('defaults to loading from public/data/apiconfig.json', function() {
        // given
        givenPathResolves('public/data');
        var emptyConfig = {};

        // when
        var apiConfig = apiConfigLoader.load(emptyConfig);

        // then
        apiConfig.should.eql(mockApiConfig);
    });

    it('can have directory specified', function() {
        // given
        givenPathResolves('some/config/dir');
        var config = {
            apiConfigDir: 'some/config/dir'
        };

        // when
        var apiConfig = apiConfigLoader.load(config);

        // then
        apiConfig.should.eql(mockApiConfig);
    });

    it('throws an error if the specified config dir cannot be found', function() {
        givenPathResolves('public/data');
        fs.existsSync.restore();
        sandbox.stub(fs, 'existsSync').withArgs('/some/resolved/path').returns(false);

        var loading = function() {apiConfigLoader.load(config)};

        loading.should.throw();
    });

    it('throws an error if loading the JSON fails', function() {
        givenPathResolves('public/data');
        jsonLoader.load.restore();
        sandbox.stub(jsonLoader, 'load').throws('Something went wrong!');

        var loading = function() {apiConfigLoader.load(config)};

        loading.should.throw();
    });
});