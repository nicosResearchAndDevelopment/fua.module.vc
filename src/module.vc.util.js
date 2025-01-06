const
    util = require('@fua/core.util');

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

exports.duplicateObject = function (obj) {
    return JSON.parse(JSON.stringify(obj));
};

exports.transferProperty = function (fromObj, fromKey, toObj, toKey, transform) {
    if (fromObj && toObj && fromObj[fromKey]) {
        toObj[toKey] = transform ? transform(fromObj[fromKey]) : fromObj[fromKey];
        delete fromObj[fromKey];
    }
};
