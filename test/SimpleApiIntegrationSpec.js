var nock = require('nock'),
    should = require('should'),
    processRequestBuilderFactory = require('./helpers/process-request-builder.js'),
    configSpawner = require('./helpers/config-spawner.js');

describe('Integrating I/O Docs with a simple unauthenticated API', function() {
    var app;
    var service = nock('http://localhost:3001');
    var processRequestBuilder;

    before(function() {
        configSpawner.setUpConfig(function(config){
            config.apiConfigDir = 'test/configs/simple';
        });
        app = require('../app.js');
        processRequestBuilder = processRequestBuilderFactory('simple');
    });

    after(function() {
        configSpawner.resetConfig();
    });

    it('relays request to GET resource by ID', function(done) {
        var id = 1234;
        var resource = {
            id: 1234,
            name: "test resource"
        };
        var getById = service
            .get('//resources/'+id)
            .reply(200, resource);

        processRequestBuilder
            .get("/resources/:id")
            .withQueryParam('id', ''+id)
            .makeRequest(app)
            .expect(200)
            .expect('Content-Type', /json/)
            .end(function(err, res) {
                res.body.headers.should.eql({});
                JSON.parse(res.body.response).should.eql(resource);
                res.body.call.should.eql('localhost:3001//resources/1234');
                res.body.code.should.eql(200);
                getById.done();
                done(err);
            });
    });
});