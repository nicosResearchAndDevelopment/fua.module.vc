const
    util                    = require('./module.vc.util.js'),
    helper                  = require('./module.vc.helper.js');

/**
 * @param {VerifiableCredential} vc The VC to sign as a JWT.
 * @param {object} options Either key, including alg and kid, or jwk, which could contain alg and kid, must be present.
 * @param {string} [options.alg]
 * @param {string} [options.kid]
 * @param {KeyLike} [options.key]
 * @param {JsonWebKey} [options.jwk]
 * @returns {Promise<JsonWebToken>}
 */
exports.sign_vc_as_jwt = async function (vc, options) {
    util.assert(util.isObject(vc), 'sign_vc_as_jwt : expected vc to be an object', TypeError);
    util.assert(util.isObject(options), 'sign_vc_as_jwt : expected options to be an object', TypeError);
    const
        key     = await helper.get_key(options),
        header  = helper.get_header(options),
        payload = helper.vc_to_claims(vc),
        jwt     = await helper.jwt_from_claims(payload, header, key);
    return jwt;
}; // sign_vc_as_jwt

/**
 * @param {JsonWebToken} jwt The JWT containing a signed VC.
 * @param {object} options Either key, getKey, jwk or jwks must be present.
 * @param {KeyLike} [options.key]
 * @param {JWTVerifyGetKey} [options.getKey]
 * @param {JsonWebKey} [options.jwk]
 * @param {Array<JsonWebKey>} [options.jwks]
 * @returns {Promise<VerifiableCredential>}
 */
exports.verify_vc_from_jwt = async function (jwt, options) {
    util.assert(util.isString(jwt), 'verify_vc_from_jwt : expected jwt to be a string', TypeError);
    util.assert(util.isObject(options), 'verify_vc_from_jwt : expected options to be an object', TypeError);
    const
        getKey  = helper.get_getKey(options),
        payload = await helper.jwt_to_claims(jwt, getKey),
        vc      = helper.vc_from_claims(payload);
    return vc;
}; // verify_vc_from_jwt

/**
 * @param {VerifiablePresentation} vp The VP to sign as a JWT.
 * @param {object} options Either key, including alg and kid, or jwk, which could contain alg and kid, must be present.
 * @param {string} [options.alg]
 * @param {string} [options.kid]
 * @param {KeyLike} [options.key]
 * @param {JsonWebKey} [options.jwk]
 * @returns {Promise<JsonWebToken>}
 */
exports.sign_vp_as_jwt = async function (vp, options) {
    util.assert(util.isObject(vp), 'sign_vp_as_jwt : expected vp to be an object', TypeError);
    util.assert(util.isObject(options), 'sign_vp_as_jwt : expected options to be an object', TypeError);
    const
        key     = await helper.get_key(options),
        header  = helper.get_header(options),
        payload = helper.vp_to_claims(vp),
        jwt     = await helper.jwt_from_claims(payload, header, key);
    return jwt;
}; // sign_vp_as_jwt

/**
 * @param {JsonWebToken} jwt The JWT containing a signed VP.
 * @param {object} options Either key, getKey, jwk or jwks must be present.
 * @param {KeyLike} [options.key]
 * @param {JWTVerifyGetKey} [options.getKey]
 * @param {JsonWebKey} [options.jwk]
 * @param {Array<JsonWebKey>} [options.jwks]
 * @returns {Promise<VerifiablePresentation>}
 */
exports.verify_vp_from_jwt = async function (jwt, options) {
    util.assert(util.isString(jwt), 'verify_vp_from_jwt : expected jwt to be a string', TypeError);
    util.assert(util.isObject(options), 'verify_vp_from_jwt : expected options to be an object', TypeError);
    const
        getKey  = helper.get_getKey(options),
        payload = await helper.jwt_to_claims(jwt, getKey),
        vp      = helper.vp_from_claims(payload);
    return vp;
}; // verify_vp_from_jwt

/**
 * @param {VerifiableCredential|VerifiablePresentation} vc_or_vp The VC or VP to sign as a JWT.
 * @param {object} options Either key, including alg and kid, or jwk, which could contain alg and kid, must be present.
 * @param {string} [options.alg]
 * @param {string} [options.kid]
 * @param {KeyLike} [options.key]
 * @param {JsonWebKey} [options.jwk]
 * @returns {Promise<JsonWebToken>}
 */
exports.sign_as_jwt = async function (vc_or_vp, options) {
    util.assert(util.isObject(vc_or_vp), 'sign_as_jwt : expected vc_or_vp to be an object', TypeError);
    util.assert(util.isObject(options), 'sign_as_jwt : expected options to be an object', TypeError);
    const
        key       = await helper.get_key(options),
        header    = helper.get_header(options),
        to_claims = {
            'VerifiableCredential':   helper.vc_to_claims,
            'VerifiablePresentation': helper.vp_to_claims
        }[helper.get_verifiable_type(vc_or_vp)],
        payload   = to_claims(vc_or_vp),
        jwt       = await helper.jwt_from_claims(payload, header, key);
    return jwt;
}; // sign_as_jwt

/**
 * @param {JsonWebToken} jwt The JWT containing a signed VP.
 * @param {object} options Either key, getKey, jwk or jwks must be present.
 * @param {KeyLike} [options.key]
 * @param {JWTVerifyGetKey} [options.getKey]
 * @param {JsonWebKey} [options.jwk]
 * @param {Array<JsonWebKey>} [options.jwks]
 * @returns {Promise<VerifiableCredential|VerifiablePresentation>}
 */
exports.verify_from_jwt = async function (jwt, options) {
    util.assert(util.isString(jwt), 'verify_from_jwt : expected jwt to be a string', TypeError);
    util.assert(util.isObject(options), 'verify_from_jwt : expected options to be an object', TypeError);
    const
        getKey      = helper.get_getKey(options),
        payload     = await helper.jwt_to_claims(jwt, getKey),
        from_claims = {
            'VerifiableCredential':   helper.vc_from_claims,
            'VerifiablePresentation': helper.vp_from_claims
        }[helper.get_claims_type(payload)],
        vc_or_vp    = from_claims(payload);
    return vc_or_vp;
}; // verify_from_jwt
