# module.vc

```ts
interface module_vc {
    VC2JWT(vc: VerifiableCredential, options: { alg?: string, key: JsonWebKey }): Promise<JsonWebToken>;
    JWT2VC(jwt: JsonWebToken, options: { keys: Array<JsonWebKey> }): Promise<VerifiableCredential>;
    VP2JWT(vp: VerifiablePresentation, options: { alg?: string, key: JsonWebKey }): Promise<JsonWebToken>;
    JWT2VP(jwt: JsonWebToken, options: { keys: Array<JsonWebKey> }): Promise<VerifiablePresentation>;
}
```
