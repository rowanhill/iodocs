var request = require('supertest');

function ServiceBuilder(apiName) {
    var get = function(URI) {
        return ProcessRequestBuilder(apiName, "GET", URI);
    };

    return {
        get: get
    };
}

function ProcessRequestBuilder(apiName, httpMethod, URI) {
    var params = {};
    var locations = {};

    /**
     * @param key {string}
     * @param value {string}
     * @returns {ProcessRequestBuilder}
     */
    var withQueryParam = function(key, value) {
        params[key] = value;
        locations[key] = 'query';
        return this;
    };

    var makeRequest = function(app) {
        return request(app)
            .post('/processReq')
            .set('Content-Type', 'application/x-www-form-urlencoded')
            .send({
                httpMethod: httpMethod,
                oauth: "",
                methodUri: URI,
                accessToken: "",
                params: params,
                locations: locations,
                apiKey: "undefined",
                apiSecret: "undefined",
                apiName: apiName
            });
    };

    return {
        withQueryParam: withQueryParam,
        makeRequest: makeRequest
    };
}

/**
 *
 * @param apiName {string}
 * @returns {ServiceBuilder}
 */
module.exports = function(apiName) {
    return ServiceBuilder(apiName);
};