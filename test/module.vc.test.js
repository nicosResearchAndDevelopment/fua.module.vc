const
    {describe, test, before}            = require('mocha'),
    expect                              = require('expect'),
    module_vc                           = require('../src/module.vc.js'),
    {generateKeyPair}                   = require('jose/util/generate_key_pair'),
    {fromKeyLike}                       = require('jose/jwk/from_key_like'),
    {createPrivateKey, createPublicKey} = require('crypto'),
    {decodeProtectedHeader}             = require('jose/util/decode_protected_header'),
    testVC                              = Object.freeze(require('./data/example-verifiable-credential.json')),
    testVP                              = Object.freeze(require('./data/example-verifiable-presentation.json')),
    testCerts                           = require('./data/certs');

describe('module.vc', function () {

    const runtime = {};
    before('generate keys and jwks', async function () {
        const randomKeyPair = await generateKeyPair('RS256');

        runtime.privateKeys = {
            random:   randomKeyPair.privateKey,
            server_1: createPrivateKey(testCerts.server_1.private),
            server_2: createPrivateKey(testCerts.server_2.private)
        };

        runtime.publicKeys = {
            random:   randomKeyPair.publicKey,
            server_1: createPublicKey(testCerts.server_1.public),
            server_2: createPublicKey(testCerts.server_2.public)
        };

        runtime.privateJwks = await Promise.all(
            Object.entries(runtime.privateKeys)
                .map(async ([kid, key]) => Object.assign(await fromKeyLike(key), {kid}))
        );

        runtime.publicJwks = await Promise.all(
            Object.entries(runtime.publicKeys)
                .map(async ([kid, key]) => Object.assign(await fromKeyLike(key), {kid}))
        );
    });

    test('sign a VC as a JWT and verify it to the same VC again', async function () {
        const
            sign_options = {alg: 'RS256', kid: 'random', key: runtime.privateKeys.random},
            jwt          = await module_vc.sign_vc_as_jwt(testVC, sign_options);

        expect(typeof jwt).toBe('string');
        console.log(jwt);
        expect(await decodeProtectedHeader(jwt)).toMatchObject({alg: sign_options.alg});

        const
            // verify_options = {key: runtime.publicKeys.random},
            verify_options = {jwks: runtime.publicJwks},
            vc             = await module_vc.verify_vc_from_jwt(jwt, verify_options);

        expect(typeof vc).toBe('object');
        console.log(vc);
        expect(vc).toEqual(testVC);
    });

    test('sign a VP as a JWT and verify it to the same VP again', async function () {
        const
            sign_options = {alg: 'RS256', kid: 'random', key: runtime.privateKeys.random},
            jwt          = await module_vc.sign_vp_as_jwt(testVP, sign_options);

        expect(typeof jwt).toBe('string');
        console.log(jwt);
        expect(await decodeProtectedHeader(jwt)).toMatchObject({alg: sign_options.alg});

        const
            // verify_options = {key: runtime.publicKeys.random},
            verify_options = {jwks: runtime.publicJwks},
            vp             = await module_vc.verify_vp_from_jwt(jwt, verify_options);

        expect(typeof vp).toBe('object');
        console.log(vp);
        expect(vp).toEqual(testVP);
    });

});
