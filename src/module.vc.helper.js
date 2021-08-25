const
    util                    = require('./module.vc.util.js'),
    // SEE https://github.com/panva/jose/blob/main/docs/classes/jwt_sign.SignJWT.md#readme
    {SignJWT}               = require('jose/jwt/sign'),
    // SEE https://github.com/panva/jose/blob/main/docs/functions/jwt_verify.jwtVerify.md#readme
    {jwtVerify}             = require('jose/jwt/verify'),
    // SEE https://github.com/panva/jose/blob/main/docs/functions/util_decode_protected_header.decodeProtectedHeader.md#readme
    {decodeProtectedHeader} = require('jose/util/decode_protected_header'),
    // SEE https://github.com/panva/jose/blob/main/docs/functions/jwk_parse.parseJwk.md#readme
    {parseJwk}              = require('jose/jwk/parse');

//region >> TYPEDEF

/**
 * @typedef {object} VerifiableCredential
 * @property {string} id
 * @property {string|Array<string>} type
 * @property {{id?: string}|Array<{id?: string}>} credentialSubject
 * @property {string|{id: string}} issuer
 * @property {string} issuanceDate
 * @property {string} [expirationDate]
 * @property {{id: string, type: string}} [credentialStatus]
 * @property {object|Array<object>} [proof]
 * @see https://www.w3.org/TR/vc-data-model/#credentials 3.2 Credentials
 */

/**
 * @typedef {object} VerifiablePresentation
 * @property {string} id
 * @property {string|Array<string>} type
 * @property {string|object|Array<string|object>} [verifiableCredential]
 * @property {string|{id: string}} [holder]
 * @property {object|Array<object>} [proof]
 * @see https://www.w3.org/TR/vc-data-model/#presentations 3.3 Presentations
 * @see https://www.w3.org/TR/vc-data-model/#presentations-0 4.10 Presentations
 */

/**
 * @typedef {string} JsonWebToken
 * @see https://datatracker.ietf.org/doc/html/rfc7519 JSON Web Token (JWT)
 */

/**
 * @typedef {object} JWTClaimsSet
 * @property {string} [iss] Issuer
 * @property {string} [sub] Subject
 * @property {string} [aud] Audience
 * @property {number} [exp] Expiration Time
 * @property {number} [nbf] Not Before
 * @property {string} [iat] Issued At
 * @property {string} [jti] JWT ID
 * @property {object} [vc] Verifiable Credential
 * @property {object} [vp] Verifiable Presentation
 * @see https://datatracker.ietf.org/doc/html/rfc7519#section-4 4. JWT Claims
 * @see https://www.w3.org/TR/vc-data-model/#json-web-token-extensions JSON Web Token Extensions
 */

/**
 * @typedef {object} JsonWebKey
 * @property {string} [kty] Key Type
 * @property {"sig"|"enc"} [use] Public Key Use
 * @property {"sign"|"verify"|"encrypt"|"decrypt"|"wrapKey"|"unwrapKey"|"deriveKey"|"deriveBits"} [key_ops] Key Operations
 * @property {string} [alg] Algorithm
 * @property {string} [kid] Key ID
 * @property {string} [x5u] X.509 URL
 * @property {string} [x5c] X.509 Certificate Chain
 * @property {string} [x5t] X.509 Certificate SHA-1 Thumbprint
 * @property {string} [x5t#S256] X.509 Certificate SHA-256 Thumbprint
 * @see https://datatracker.ietf.org/doc/html/rfc7517#section-4 4. JSON Web Key (JWK) Format
 */

/**
 * @typedef {object} KeyLike
 * @see https://github.com/panva/jose/blob/main/docs/types/types.KeyLike.md Type alias: KeyLike
 */

/**
 * @typedef {function(protectedHeader: object, token: object): Promise<KeyLike>} JWTVerifyGetKey
 * @see https://github.com/panva/jose/blob/main/docs/interfaces/jwt_verify.JWTVerifyGetKey.md Interface: JWTVerifyGetKey
 * @see https://github.com/panva/jose/blob/main/docs/functions/jwks_remote.createRemoteJWKSet.md Function: createRemoteJWKSet
 * @see https://github.com/panva/jose/blob/main/docs/interfaces/jwks_remote.RemoteJWKSetOptions.md Interface: RemoteJWKSetOptions
 */

//endregion >> TYPEDEF

/**
 * @param {VerifiableCredential} vc
 * @returns {JWTClaimsSet}
 */
exports.vc_to_claims = function (vc) {
    const claims = {vc: util.duplicateObject(vc)};
    if (claims.vc.proof) delete claims.vc.proof;
    util.transferProperty(claims.vc, 'id', claims, 'jti');
    util.transferProperty(claims.vc, 'issuer', claims, 'iss');
    util.transferProperty(claims.vc.credentialSubject, 'id', claims, 'sub');
    util.transferProperty(claims.vc, 'issuanceDate', claims, 'nbf', util.dateTimeToUnixTime);
    util.transferProperty(claims.vc, 'expirationDate', claims, 'exp', util.dateTimeToUnixTime);
    return claims;
}; // vc_to_claims

/**
 * @param {JWTClaimsSet} claims
 * @param {object} claims.vc
 * @returns {VerifiableCredential}
 */
exports.vc_from_claims = function (claims) {
    claims = util.duplicateObject(claims);
    if (claims.vc.proof) delete claims.vc.proof;
    util.transferProperty(claims, 'jti', claims.vc, 'id');
    util.transferProperty(claims, 'iss', claims.vc, 'issuer');
    util.transferProperty(claims, 'sub', claims.vc.credentialSubject, 'id');
    util.transferProperty(claims, 'nbf', claims.vc, 'issuanceDate', util.unixTimeToDateTime);
    util.transferProperty(claims, 'exp', claims.vc, 'expirationDate', util.unixTimeToDateTime);
    return claims.vc;
}; // vc_from_claims

/**
 * @param {VerifiablePresentation} vp
 * @returns {JWTClaimsSet}
 */
exports.vp_to_claims = function (vp) {
    const claims = {vp: util.duplicateObject(vp)};
    if (claims.vp.proof) delete claims.vp.proof;
    util.transferProperty(claims.vp, 'id', claims, 'jti');
    util.transferProperty(claims.vp, 'holder', claims, 'iss');
    return claims;
}; // vp_to_claims

/**
 * @param {JWTClaimsSet} claims
 * @param {object} claims.vp
 * @returns {VerifiablePresentation}
 */
exports.vp_from_claims = function (claims) {
    claims = util.duplicateObject(claims);
    if (claims.vp.proof) delete claims.vp.proof;
    util.transferProperty(claims, 'jti', claims.vp, 'id');
    util.transferProperty(claims, 'iss', claims.vp, 'holder');
    return claims.vp;
}; // vp_from_claims

/**
 * @param {JsonWebToken} jwt
 * @param {KeyLike|JWTVerifyGetKey} getKey
 * @returns {Promise<JWTClaimsSet>}
 */
exports.jwt_to_claims = async function (jwt, getKey) {
    const {payload: claims} = await jwtVerify(jwt, getKey);
    return claims;
}; // jwt_to_claims

/**
 * @param {JWTClaimsSet} claims
 * @param {object} header
 * @param {KeyLike} key
 * @returns {Promise<JsonWebToken>}
 */
exports.jwt_from_claims = async function (claims, header, key) {
    const jwt = await new SignJWT(claims)
        .setProtectedHeader(header)
        .sign(key);
    return jwt;
}; // jwt_from_claims

exports.get_header = function ({alg, kid, jwk}) {
    return {
        typ: 'JWT',
        alg: alg ?? jwk?.alg,
        kid: kid ?? jwk?.kid
    };
}; // get_header

exports.get_jwt_header = async function (jwt) {
    return await decodeProtectedHeader(jwt);
}; // get_jwt_header

/**
 * @param {KeyLike} key
 * @param {JsonWebKey} [jwk]
 * @param {string} [alg]
 * @returns {Promise<KeyLike>}
 */
exports.get_key = async function ({key, jwk, alg}) {
    if (util.isObject(key)) return key;
    if (util.isObject(jwk)) return await parseJwk(jwk, alg);
    util.assert(false, 'helper.create_key : unexpected arguments');
}; // get_key

/**
 * @param {JWTVerifyGetKey} [getKey]
 * @param {KeyLike} [key]
 * @param {JsonWebKey} [jwk]
 * @param {Array<JsonWebKey>} [jwks]
 * @returns {JWTVerifyGetKey}
 */
exports.get_getKey = function ({getKey, key, jwk, jwks}) {
    if (util.isFunction(getKey)) return getKey;
    if (util.isObject(key)) return () => key;
    if (util.isObject(jwk)) return ({alg}) => parseJwk(jwk, alg);
    if (util.isObjectArray(jwks)) return ({alg, kid}) => parseJwk(jwks.find(jwk => jwk.kid === kid) || jwks[0], alg);
    util.assert(false, 'helper.create_getKey : unexpected arguments');
}; // get_getKey

/**
 * @param {JWTClaimsSet} claims
 * @returns {string}
 */
exports.get_claims_type = function (claims) {
    if (claims.vc) return 'VerifiableCredential';
    if (claims.vp) return 'VerifiablePresentation';
    util.assert(false, 'helper.get_claims_type : unexpected arguments');
}; // get_claims_type

/**
 * @param {VerifiableCredential|VerifiablePresentation} verifiable
 * @returns {string}
 */
exports.get_verifiable_type = function (verifiable) {
    if (util.toArray(verifiable.type).includes('VerifiableCredential')) return 'VerifiableCredential';
    if (util.toArray(verifiable.type).includes('VerifiablePresentation')) return 'VerifiablePresentation';
    util.assert(false, 'helper.get_verifiable_type : unexpected arguments');
}; // get_verifiable_type
