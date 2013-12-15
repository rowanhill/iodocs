var redis = require('redis');

exports.configure = function(redisConfig) {
    var defaultDB = '0';
    redisConfig.database = redisConfig.database || defaultDB;

    if (process.env.REDISTOGO_URL) {
        var rtg   = require("url").parse(process.env.REDISTOGO_URL);
        redisConfig.host = rtg.hostname;
        redisConfig.port = rtg.port;
        redisConfig.password = rtg.auth.split(":")[1];
    }

    var db = redis.createClient(redisConfig.port, redisConfig.host);
    db.auth(redisConfig.password);

    db.on("error", function(err) {
        if (config.debug) {
            console.log("Error " + err);
        }
    });

    return db;
};