const
    // SEE https://github.com/panva/jose/blob/main/docs/classes/jwt_sign.SignJWT.md#readme
    {SignJWT}               = require('jose/jwt/sign'),
    // SEE https://github.com/panva/jose/blob/main/docs/functions/jwt_verify.jwtVerify.md#readme
    {jwtVerify}             = require('jose/jwt/verify'),
    // SEE https://github.com/panva/jose/blob/main/docs/functions/util_decode_protected_header.decodeProtectedHeader.md#readme
    {decodeProtectedHeader} = require('jose/util/decode_protected_header'),
    // SEE https://github.com/panva/jose/blob/main/docs/functions/jwk_parse.parseJwk.md#readme
    {parseJwk}              = require('jose/jwk/parse'),
    util                    = require('./module.vc.util.js');

// TODO maybe change the usage of jwk instead of key-likes or offer both
// TODO evaluate, maybe change and confirm the current api draft
// TODO implement more elaborate functions
// -> maybe to differentiate between vc and vp by their type
// -> maybe to validate vc and vp structure better
// -> maybe to use a custom vc and vp class
// TODO improve key selection for validation
// TODO maybe implement and use a key-store class
// TODO write tests with consistent/persistent key-store

/**
 * @param {VerifiableCredential} vc
 * @param {object} options
 * @param {string} [options.alg]
 * @param {JsonWebKey} options.key
 * @returns {Promise<JsonWebToken>}
 */
exports.VC2JWT = async function (vc, options) {
    util.assert(util.isObject(vc), 'VC2JWT : expected vc to be an object', TypeError);
    util.assert(util.isObject(options), 'VC2JWT : expected options to be an object', TypeError);
    util.assert(util.isObject(options.key), 'VC2JWT : expected options.key to be an object', TypeError);
    const
        key     = await parseJwk(options.key),
        header  = {
            typ: 'JWT',
            alg: options.alg || options.key.alg || undefined,
            kid: options.key.kid || undefined
        },
        payload = {
            vc: JSON.parse(JSON.stringify(vc))
        };
    if (payload.vc.proof) delete payload.vc.proof;
    util.transferProperty(payload.vc, 'id', payload, 'jti');
    util.transferProperty(payload.vc, 'issuer', payload, 'iss');
    util.transferProperty(payload.vc.credentialSubject, 'id', payload, 'sub');
    util.transferProperty(payload.vc, 'issuanceDate', payload, 'nbf', util.dateTimeToUnixTime);
    util.transferProperty(payload.vc, 'expirationDate', payload, 'exp', util.dateTimeToUnixTime);
    const jwt = await new SignJWT(payload)
        .setProtectedHeader(header)
        .sign(key);
    return jwt;
}; // VC2JWT

/**
 * @param {JsonWebToken} jwt
 * @param {object} options
 * @param {Array<JsonWebKey>} options.keys
 * @returns {Promise<VerifiableCredential>}
 */
exports.JWT2VC = async function (jwt, options) {
    util.assert(util.isString(jwt), 'JWT2VC : expected jwt to be a string', TypeError);
    util.assert(util.isObject(options), 'VC2JWT : expected options to be an object', TypeError);
    util.assert(util.isObjectArray(options.keys) && options.keys.length > 0, 'VC2JWT : expected options.keys to be a non-empty object array', TypeError);
    const
        header    = await decodeProtectedHeader(jwt),
        key       = await parseJwk(options.keys.find(key => key.kid === header.kid)),
        // TODO key selection and validation
        {payload} = await jwtVerify(jwt, key);
    util.transferProperty(payload, 'jti', payload.vc, 'id');
    util.transferProperty(payload, 'iss', payload.vc, 'issuer');
    util.transferProperty(payload, 'sub', payload.vc.credentialSubject, 'id');
    util.transferProperty(payload, 'nbf', payload.vc, 'issuanceDate', util.unixTimeToDateTime);
    util.transferProperty(payload, 'exp', payload.vc, 'expirationDate', util.unixTimeToDateTime);
    return payload.vc;
}; // JWT2VC

/**
 * @param {VerifiablePresentation} vp
 * @param {object} options
 * @param {string} [options.alg]
 * @param {JsonWebKey} options.key
 * @returns {Promise<JsonWebToken>}
 */
exports.VP2JWT = async function (vp, options) {
    util.assert(util.isObject(vp), 'VP2JWT : expected vp to be an object', TypeError);
    util.assert(util.isObject(options), 'VP2JWT : expected options to be an object', TypeError);
    util.assert(util.isObject(options.key), 'VP2JWT : expected options.key to be an object', TypeError);
    const
        key     = await parseJwk(options.key),
        header  = {
            typ: 'JWT',
            alg: options.alg || options.key.alg || undefined,
            kid: options.key.kid || undefined
        },
        payload = {
            vp: JSON.parse(JSON.stringify(vp))
        };
    if (payload.vp.proof) delete payload.vp.proof;
    util.transferProperty(payload.vp, 'id', payload, 'jti');
    util.transferProperty(payload.vp, 'holder', payload, 'iss');
    // util.transferProperty(payload.vp, 'issuanceDate', payload, 'nbf', util.dateTimeToUnixTime);
    // util.transferProperty(payload.vp, 'expirationDate', payload, 'exp', util.dateTimeToUnixTime);
    const jwt = await new SignJWT(payload)
        .setProtectedHeader(header)
        .sign(key);
    return jwt;
}; // VP2JWT

/**
 * @param {JsonWebToken} jwt
 * @param {object} options
 * @param {Array<JsonWebKey>} options.keys
 * @returns {Promise<VerifiablePresentation>}
 */
exports.JWT2VP = async function (jwt, options) {
    util.assert(util.isString(jwt), 'JWT2VP : expected jwt to be a string', TypeError);
    util.assert(util.isObject(options), 'JWT2VP : expected options to be an object', TypeError);
    util.assert(util.isObjectArray(options.keys) && options.keys.length > 0, 'JWT2VP : expected options.keys to be a non-empty object array', TypeError);
    const
        header    = await decodeProtectedHeader(jwt),
        key       = await parseJwk(options.keys.find(key => key.kid === header.kid)),
        // TODO key selection and validation
        {payload} = await jwtVerify(jwt, key);
    util.transferProperty(payload, 'jti', payload.vp, 'id');
    util.transferProperty(payload, 'iss', payload.vp, 'holder');
    // util.transferProperty(payload, 'nbf', payload.vp, 'issuanceDate', util.unixTimeToDateTime);
    // util.transferProperty(payload, 'exp', payload.vp, 'expirationDate', util.unixTimeToDateTime);
    return payload.vp;
}; // JWT2VP
