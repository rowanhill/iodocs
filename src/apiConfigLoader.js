var fs = require('fs'),
    path = require('path'),
    util = require('util'),
    jsonLoader = require('./jsonLoader.js');

/**
 * Loads the APIs' configuration object from the directory specified by config.apiConfigDir. The value of
 * config.apiConfigdir is also updated to be a fully resolved path.
 *
 * @param config {Object} I/O Docs config object
 * @returns {*}
 */
exports.load = function(config) {
    var apiConfigFile = '[config file not yet set]',
        apisConfig;

    config.apiConfigDir = path.resolve(config.apiConfigDir || 'public/data');
    if (!fs.existsSync(config.apiConfigDir)) {
        throw new Error("Could not find API config directory: " + apiConfigDir);
    }

    try {
        apiConfigFile = path.join(config.apiConfigDir, 'apiconfig.json');
        apisConfig = jsonLoader.load(apiConfigFile);
    } catch(e) {
        throw new Error("File " + apiConfigFile + " not found or is invalid.");
    }

    if (config.debug) {
        console.log(util.inspect(apisConfig));
    }

    return apisConfig;
};