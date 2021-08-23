const
    util = require('@nrd/fua.core.util');

exports = module.exports = {
    ...util,
    assert: new util.Assert('module.vc')
};

/**
 * @typedef {object} VerifiableCredential
 * @see https://www.w3.org/TR/vc-data-model/#credentials
 */

/**
 * @typedef {object} VerifiablePresentation
 * @see https://www.w3.org/TR/vc-data-model/#presentations
 */

/**
 * @typedef {string} JsonWebToken
 * @see https://datatracker.ietf.org/doc/html/rfc7519
 */

/**
 * @typedef {string} JsonWebKey
 * @see https://datatracker.ietf.org/doc/html/rfc7517#section-4
 */

/**
 * @typedef {object} KeyLike
 * @see https://github.com/panva/jose/blob/main/docs/types/types.KeyLike.md
 */

exports.dateTimeToUnixTime = function (dateTime) {
    return 1e-3 * Date.parse(dateTime);
};

exports.unixTimeToDateTime = function (unixTime) {
    return new Date(1e3 * unixTime).toISOString();
};

exports.transferProperty = function (fromObj, fromKey, toObj, toKey, transform) {
    if (fromObj && toObj && fromObj[fromKey]) {
        toObj[toKey] = transform ? transform(fromObj[fromKey]) : fromObj[fromKey];
        delete fromObj[fromKey];
    }
};
