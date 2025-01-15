//const
//    resourcePath = process.env.FUA_RESOURCES,
//    remotePath   = process.env.FUA_REMOTES,
//    fua          = global['fua'],
//    hrt          = fua['core']['hrt'],
//    uuid         = fua['core']['uuid']
//; // const

const
    name           = "test.w3c.vc",
    libPath        = process.env.FUA_JS_LIB,
    app            = require(`${libPath}core.app\\src\\core.app.js`)({
        'name':     name,
        'lib_path': libPath
    }),
    // https://github.com/panva/jose
    {
        JWE,   // JSON Web Encryption (JWE)
        JWK,   // JSON Web Key (JWK)
        JWKS,  // JSON Web Key Set (JWKS)
        JWS,   // JSON Web Signature (JWS)
        JWT   // JSON Web Token (JWT)
    }              = require('jose'),
    fua            = global['fua'],
    //
    id_lex         = "id",
    type_lex       = "type",
    {DID}          = require(`${libPath}impl/w3c/did/src/w3c.did.js`)({
        'id_lex':   id_lex,
        'type_lex': type_lex
    }),
    vc             = require(`${libPath}impl/w3c/vc/src/w3c.vc.js`)({
        'id_lex':   id_lex,
        'type_lex': type_lex
    })
;
let
    proofs,
    credentialSubject,
    verifiableCredential,
    disputeCredential,
    verifiablePresentation,
    issuanceDate   = (new Date),
    expirationDate = new Date((new Date(issuanceDate.valueOf())).setDate(issuanceDate.getDate() + 7)),

    serialized
; // let

//region freestyle
if (true) {

    proofs = {
        'verifiableCredential_RsaSignature2018':   vc.proof.factory({'type': "RsaSignature2018", 'tokenType': "jws"}),
        'verifiablePresentation_RsaSignature2018': vc.proof.factory({'type': "RsaSignature2018", 'tokenType': "jws"})
    };

    credentialSubject    = {

        '@context':               ["https://w3id.org/idsa/contexts/context.jsonld"],
        '@id':                    "did:ids:hashed_skiaki_of_GAIAboX_X509",
        // REM: moved also to vc.type
        '@type':                  "ids:DatPayload",
        "ids:referringConnector": "https://GAIAboX.nicos-rd.com/GAIAboX",
        "ids:securityProfile":    "idsc:BASE_CONNECTOR_SECURITY_PROFILE",
        "ids:extendedGuarantee":  "idsc:USAGE_CONTROL_POLICY_ENFORCEMENT"

        //"@context":             "https://w3id.org/idsa/contexts/context.jsonld",
        //"@type":                "ids:DatPayload",
        //"iss":                  "https://daps.aisec.fraunhofer.de",
        //"sub":                  "DD:CB:FD:0B:93:84:33:01:11:EB:5D:94:94:88:BE:78:7D:57:FC:4A:keyid:CB:8C:C7:B6:85:79:A8:23:A6:CB:15:AB:17:50:2F:E6:65:43:5D:E8",
        //"referringConnector":   "http://some-connector-uri.com",
        //"securityProfile":      "idsc:BASE_CONNECTOR_SECURITY_PROFILE",
        //"extendedGuarantee":    "idsc:USAGE_CONTROL_POLICY_ENFORCEMENT",
        //"transportCertsSha256": ["bacb879575730bb083f283fd5b67a8cb..."],
        //"iat":                  1516239022,
        //"exp":                  1516239032,
        //"aud":                  "https://w3id.org/idsa/code/IDS_CONNECTORS_ALL",
        //"nbf":                  1567703561,
        //"scope":                "ids_connector_attributes"

        //'memberOf': {
        //    'id':    "did:ids:ecosystem",
        //    'label': [{'value': "IDS Eco System", 'lang': "en"}]
        //}
    };
    verifiableCredential = new vc.VerifiableCredential({
        '@context':          ["https://w3id.org/idsa/contexts/context.jsonld"],
        'id':                "https://daps.nicos-rd.com/vc/hashed_skiaki_of_GAIAboX_X509",
        'type':              ["ids:DatPayload"],
        // REM: a different route, than given "/" (to make a POST-request to get
        //  JWT/DAT the usual way
        'issuer':            new vc.Issuer({'id': "https://www.internationaldataspaces.org/certificationbody/"}),
        //
        'credentialSubject': credentialSubject,
        'credentialSchema':  new vc.CredentialSchema({
            'id':   "https://example.org/examples/degree.json",
            'type': "JsonSchemaValidator2018"
        }),
        'termsOfUse':        {
            'type': "odrl:Offer"
        }
    });
    disputeCredential    = new vc.DisputeCredential({
        '@context':          [],
        'id':                "http://example.com/credentials/245",
        //'type':              ["DisputeCredential"],
        // REM: a different route, than given "/" (to make a POST-request to get
        //  JWT/DAT the usual way
        'issuer':            new vc.Issuer({'id': "https://example.com/people#me"}),
        //
        'credentialSubject': {
            "id":            "http://example.com/credentials/245",
            "currentStatus": "Disputed",
            "statusReason":  {
                "value": "Address is out of date.",
                "lang":  "en"
            }
        },
        'nonTransferable': false
    });

    serialized = disputeCredential.issue({
        'issuanceDate':   issuanceDate.toISOString(),
        'expirationDate': expirationDate.toISOString(),
        'proof':          proofs.verifiablePresentation_RsaSignature2018,
        'to':             "json"
    });

    issuanceDate   = (new Date);
    //expirationDate = new Date((new Date(issuanceDate.valueOf())).setDate(issuanceDate.getDate() + 7));
    expirationDate = new Date(issuanceDate.setDate(issuanceDate.getDate() + 7));

    verifiablePresentation = new vc.VerifiablePresentation({
        '@context':             [],
        'type':                 [],
        'holder':               "https://daps.nicos-rd.com/vc/",
        'verifiableCredential': [
            verifiableCredential['issue']({
                'proof':          proofs.verifiableCredential_RsaSignature2018,
                'to':             "json",
                'issuanceDate':   issuanceDate.toISOString(),
                'expirationDate': expirationDate.toISOString()
            }),
            disputeCredential['issue']({
                'proof':          proofs.verifiableCredential_RsaSignature2018,
                'to':             "json",
                'issuanceDate':   issuanceDate.toISOString(),
                'expirationDate': expirationDate.toISOString()
            })
        ]
    });

    serialized = verifiablePresentation.issue({
        'proof': proofs.verifiablePresentation_RsaSignature2018,
        'challenge': `${Math.random()}`,
        'domain': "https://www.nicos-rd.com",
        'to':    "json"
    });
    console.log(JSON.stringify(serialized, "", "\t"));
    serialized;
} // if (fresstyle shield)
//endregion freestyle

//verifiablePresentation['toJson'](proofs.verifiableCredential_RsaSignature2018).then((result_vp) => {
//    result_vp;
//}).catch((err) => {
//    err;
//});