var fs = require('fs'),
    path = require('path');

var configJsonPath = path.join(process.cwd(), 'config.json');
var configJsonBackupPath = configJsonPath + '.bak';
var configJsonSamplePath = configJsonPath + '.sample';
var configWasPresentBeforeTest = false;

/**
 * Back-up any existing config.json and write a new one based on config.json.sample (modified by updateCallback).
 *
 * @param updateCallback {function}
 */
exports.setUpConfig = function(updateCallback) {
    if (fs.existsSync(configJsonPath)) {
        configWasPresentBeforeTest = true;
        fs.renameSync(configJsonPath, configJsonBackupPath);
    }
    var config = JSON.parse(fs.readFileSync(configJsonSamplePath));
    updateCallback(config);
    fs.writeFileSync(configJsonPath, JSON.stringify(config, null, 4));
};

/**
 * Removes any config.json that may exist, and replaces any back-up that may have existed previously
 */
exports.resetConfig = function() {
    if (fs.existsSync(configJsonPath)) {
        if (fs.existsSync(configJsonBackupPath)) {
            fs.unlinkSync(configJsonPath);
            fs.renameSync(configJsonBackupPath, configJsonPath);
        } else if (!configWasPresentBeforeTest) {
            fs.unlinkSync(configJsonPath);
        }
    }
};