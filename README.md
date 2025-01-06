# @fua/module.vc

```ts
interface module_vc {

    sign_vc_as_jwt(
        vc: VerifiableCredential,
        options: {
            alg?: string,
            kid?: string,
            key?: KeyLike,
            jwk?: JsonWebKey
        }
    ): Promise<JsonWebToken>;

    verify_vc_from_jwt(
        jwt: JsonWebToken,
        options: {
            key?: KeyLike,
            getKey?: JWTVerifyGetKey,
            jwk?: JsonWebKey,
            jwks?: Array<JsonWebKey>
        }
    ): Promise<VerifiableCredential>;

    sign_vp_as_jwt(
        vp: VerifiablePresentation,
        options: {
            alg?: string,
            kid?: string,
            key?: KeyLike,
            jwk?: JsonWebKey
        }
    ): Promise<JsonWebToken>;

    verify_vp_from_jwt(
        jwt: JsonWebToken,
        options: {
            key?: KeyLike,
            getKey?: JWTVerifyGetKey,
            jwk?: JsonWebKey,
            jwks?: Array<JsonWebKey>
        }
    ): Promise<VerifiablePresentation>;

    sign_as_jwt(
        vc_or_vp: VerifiableCredential | VerifiablePresentation,
        options: {
            alg?: string,
            kid?: string,
            key?: KeyLike,
            jwk?: JsonWebKey
        }
    ): Promise<JsonWebToken>;

    verify_from_jwt(
        jwt: JsonWebToken,
        options: {
            key?: KeyLike,
            getKey?: JWTVerifyGetKey,
            jwk?: JsonWebKey,
            jwks?: Array<JsonWebKey>
        }
    ): Promise<VerifiableCredential | VerifiablePresentation>;

};
```

> NOTE:
> For type reference see [region TYPEDEF](src/module.vc.helper.js).

## sign_vc_as_jwt

```js
const
    vc  = {...},
    alg = 'RS256',
    kid = 'did:example:key-1629816911496',
    jwk = {
        "alg": alg,
        "kid": kid,
        "p":   "wwVNJUAodPyk2D1iB_X81-t9TwL-64YJgmMf4IRO8gz0FptePhMOcVVuzWeuUlxHBw24abWt0OI42pfnJimToNNCvI_AOf68SnL...",
        "kty": "RSA",
        "q":   "tOb9zC0RAkkvEtzEcyEd6g287SCZvWGYjXZSIpr7g8j7ONtD0_4rW86gbsb2UCXNZesOsIN3PfLG8wgE26iq7pn1y8S9_Gj7SsH...",
        "d":   "WgEN6AW-6aSz8y5T1BVFlLU6n5VX1KmqU3z4CbK_YpdOmakxnaynnQVhV7iq4ftg0pngHDOSqapyGhyyUD3_QvebBP_FCnDMvmJ...",
        "e":   "AQAB",
        "qi":  "GVrxQszEbfSuKu3BIPKpv1TzevwwWTcIfMQ3ai0gnvo_UzRbGAuPeQd3Pe-imTb7e8jdymqGOaU4pN7OWk2MhBvZS5xwNgcmtT_...",
        "dp":  "dmYFjBQDe-LWgaHinkqtkrkZfpqnAX6Cz3I2rCwncbSDjCYPdUhEgHIJrxK_NqlnRdUCnMr8F9EAC1Yls3mScxVPcwMjBRKuZdS...",
        "dq":  "KotswvkSV_xIMuJy3TS7qVEDzqztG0n5q8NY-8SBRHQfCTcgE5piLhxBROxL_3t0e_S1JrQ0dgBD4-JN6i8XzDevQ_YITHWQK_u...",
        "n":   "ic-yWUhgRFlReQ7EaFDTW4O78NT4DqaHm9l0lhGXOGrN66_r8d_ai3vJGcpOUclBJS6oAe-a7ZK2l5mVWhaOto7i_uFae3WeN54..."
    },
    key = await parseJwk(jwk, alg);

// Variant 1:
const jwt = await sign_vc_as_jwt(vc, {alg, kid, key});

// Variant 2:
const jwt = await sign_vc_as_jwt(vc, {alg, kid, jwk});

// internally all variants will get converted to the key method
```

## verify_vc_from_jwt

```js
const
    jwt    = '...',
    alg    = 'RS256',
    kid    = 'did:example:key-1629816911496',
    jwk    = {
        "alg": alg,
        "kid": kid,
        "kty": "EC",
        "crv": "P-256",
        "x":   "f83OJ3D2xF1Bg8vub9tLe1gHMzV76e8Tus9uPHvRVEU",
        "y":   "x_FEzRu9m36HLN_tue659LNpXW6pCyStikYjKIWI5a0"
    },
    jwks   = [jwk],
    key    = await parseJwk(jwk, alg),
    // getKey = async (header, token) => key,
    getKey = (header, token) => parseJwk(jwks.find(jwk => jwk.kid === header.kid) || jwks[0], header.alg);

// Variant 1:
const vc = await verify_vc_from_jwt(jwt, {key});

// Variant 2:
const vc = await verify_vc_from_jwt(jwt, {jwk});

// Variant 3:
const vc = await verify_vc_from_jwt(jwt, {jwks});

// Variant 4:
const vc = await verify_vc_from_jwt(jwt, {getKey});

// internally all variants will get converted to the getKey method
```
