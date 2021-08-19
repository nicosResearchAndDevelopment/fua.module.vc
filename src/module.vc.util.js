const
    util = require('@nrd/fua.core.util');

exports = module.exports = {
    ...util,
    assert: new util.Assert('module.vc')
};

exports.dateTimeToUnixTime = function (dateTime) {
    return 1e-3 * Date.parse(dateTime);
};

exports.unixTimeToDateTime = function (unixTime) {
    return new Date(1e3 * unixTime).toISOString();
};
