const
    asyncIIFE               = (fn, ...args) => fn.apply(null, args).catch(err => console.error(err?.stack ?? err)),
    // SEE https://github.com/panva/jose/blob/main/docs/functions/util_generate_key_pair.generateKeyPair.md#readme
    {generateKeyPair}       = require('jose/util/generate_key_pair'),
    // SEE https://github.com/panva/jose/blob/main/docs/classes/jwt_sign.SignJWT.md#readme
    {SignJWT}               = require('jose/jwt/sign'),
    // SEE https://github.com/panva/jose/blob/main/docs/functions/jwt_verify.jwtVerify.md#readme
    {jwtVerify}             = require('jose/jwt/verify'),
    // SEE https://github.com/panva/jose/blob/main/docs/functions/util_decode_protected_header.decodeProtectedHeader.md#readme
    {decodeProtectedHeader} = require('jose/util/decode_protected_header'),
    // SEE https://github.com/panva/jose/blob/main/docs/functions/jwk_parse.parseJwk.md#readme
    {parseJwk}              = require('jose/jwk/parse'),
    // SEE https://github.com/panva/jose/blob/main/docs/functions/jwk_from_key_like.fromKeyLike.md#readme
    {fromKeyLike}           = require('jose/jwk/from_key_like');

asyncIIFE(async function main() {

    const alg = 'RS256', options = {extractable: true};
    console.log({alg, options});

    const {privateKey, publicKey} = await generateKeyPair(alg, options);
    console.log({privateKey, publicKey});

    const [privateJWK, publicJWK] = await Promise.all([privateKey, publicKey]
        .map(keyLike => fromKeyLike(keyLike)));
    privateJWK.alg                = publicJWK.alg = alg;
    privateJWK.kid                = publicJWK.kid = 'did:example:key#' + Date.now();
    console.log({privateJWK, publicJWK});

    const [privateKey2, publicKey2] = await Promise.all([privateJWK, publicJWK]
        .map(jwk => parseJwk(jwk, alg)));
    console.log({privateKey2, publicKey2});

    const [privateJWK2, publicJWK2] = await Promise.all([privateKey2, publicKey2]
        .map(keyLike => fromKeyLike(keyLike)));
    console.log({privateJWK2, publicJWK2});

    // => alg and kid got removed in the process of parsing into a jwk

});
