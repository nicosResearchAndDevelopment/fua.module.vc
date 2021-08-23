const
    {describe, test, before} = require('mocha'),
    expect                   = require('expect'),
    module_vc                = require('../src/module.vc.js'),
    {generateKeyPair}        = require('jose/util/generate_key_pair'),
    {fromKeyLike}            = require('jose/jwk/from_key_like'),
    {decodeProtectedHeader}  = require('jose/util/decode_protected_header'),
    testVC                   = Object.freeze(require('./data/example-verifiable-credential.json')),
    testVP                   = Object.freeze(require('./data/example-verifiable-presentation.json'));

describe('module.vc', function () {

    const encryptOptions = {alg: 'RS256'}, decryptOptions = {keys: []};
    before('generate key pair', async function () {
        const
            {privateKey, publicKey} = await generateKeyPair(encryptOptions.alg),
            [privateJWK, publicJWK] = await Promise.all([privateKey, publicKey].map(fromKeyLike));

        privateJWK.alg     = publicJWK.alg = encryptOptions.alg;
        privateJWK.kid     = publicJWK.kid = 'did:example:marzipan#key-' + Date.now();
        encryptOptions.key = Object.freeze(privateJWK);
        decryptOptions.keys.push(Object.freeze(publicJWK));
    });

    test('sign a VC as a JWT and verify it to the same VC again', async function () {
        const jwt = await module_vc.VC2JWT(testVC, encryptOptions);
        expect(typeof jwt).toBe('string');
        console.log(jwt);
        expect(await decodeProtectedHeader(jwt)).toMatchObject({alg: encryptOptions.alg});
        const vc = await module_vc.JWT2VC(jwt, decryptOptions);
        expect(typeof vc).toBe('object');
        console.log(vc);
        expect(vc).toEqual(testVC);
    });

    test('sign a VP as a JWT and verify it to the same VP again', async function () {
        const jwt = await module_vc.VP2JWT(testVP, encryptOptions);
        expect(typeof jwt).toBe('string');
        console.log(jwt);
        expect(await decodeProtectedHeader(jwt)).toMatchObject({alg: encryptOptions.alg});
        const vp = await module_vc.JWT2VP(jwt, decryptOptions);
        expect(typeof vp).toBe('object');
        console.log(vp);
        expect(vp).toEqual(testVP);
    });

});
