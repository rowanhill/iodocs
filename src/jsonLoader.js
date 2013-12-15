/**
 * Requires the given path and returns an object.
 *
 * This is a trivial wrapper for require(), used so that it can be stubbed in tests
 *
 * @param path {string}
 * @returns {*}
 */
exports.load = function(path) {
    return require(path);
};