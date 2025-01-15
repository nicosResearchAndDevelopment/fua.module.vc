//const
//;

module.exports = ({
                      'prefix':   prefix = "",
                      'id_lex':   id_lex = "id",
                      'type_lex': type_lex = "type"
                  }) => {

    const
        fua = global['fua']
        //Server = fua['module']['Server']
    ; //const

    let carrier = {};

    function xsdDataTimeStamp() {
        return (new Date).toISOString();
    }

    function typeArrayContainsType(arr, type) {
        let result = false;
        for (let i = 0, length = arr.length; ((i < length) && (!result)); i++) {
            result = (arr[i] === type);
        } // for()
        return result;
    } //

    const
        proof                  = require(`./proof.js`)({
            'prefix':           prefix,
            'id_lex':           id_lex,
            'type_lex':         type_lex,
            'xsdDataTimeStamp': xsdDataTimeStamp
        }),
        Issuer                 = require(`./Issuer.js`)({
            'prefix':                prefix,
            'id_lex':                id_lex,
            'type_lex':              type_lex,
            'xsdDataTimeStamp':      xsdDataTimeStamp,
            'typeArrayContainsType': typeArrayContainsType
        }),
        RefreshService         = require(`./RefreshService.js`)({
            'prefix':                prefix,
            'id_lex':                id_lex,
            'type_lex':              type_lex,
            'xsdDataTimeStamp':      xsdDataTimeStamp,
            'typeArrayContainsType': typeArrayContainsType
        }),
        CredentialSchema       = require(`./CredentialSchema.js`)({
            'prefix':                prefix,
            'id_lex':                id_lex,
            'type_lex':              type_lex,
            'xsdDataTimeStamp':      xsdDataTimeStamp,
            'typeArrayContainsType': typeArrayContainsType
        }),
        VerifiableCredential   = require(`./VerifiableCredential.js`)({
            'prefix':                prefix,
            'id_lex':                id_lex,
            'type_lex':              type_lex,
            'xsdDataTimeStamp':      xsdDataTimeStamp,
            'typeArrayContainsType': typeArrayContainsType,
            // alpha

            'CredentialSchema': CredentialSchema,
            'Issuer':           Issuer,
            'proof':            proof,
            'RefreshService':   RefreshService
        }),
        DisputeCredential      = require(`./DisputeCredential.js`)({
            'prefix':                prefix,
            'id_lex':                id_lex,
            'type_lex':              type_lex,
            'xsdDataTimeStamp':      xsdDataTimeStamp,
            'typeArrayContainsType': typeArrayContainsType,
            //
            'VerifiableCredential': VerifiableCredential
        }),
        VerifiablePresentation = require(`./VerifiablePresentation.js`)({
            'prefix':                prefix,
            'id_lex':                id_lex,
            'type_lex':              type_lex,
            'xsdDataTimeStamp':      xsdDataTimeStamp,
            'typeArrayContainsType': typeArrayContainsType,
            //
            'proof':                proof,
            'VerifiableCredential': VerifiableCredential
        })
    ;

    carrier['Issuer']                 = Issuer;
    carrier['CredentialSchema']       = CredentialSchema;
    carrier['VerifiableCredential']   = VerifiableCredential;
    carrier['DisputeCredential']      = DisputeCredential;
    carrier['VerifiablePresentation'] = VerifiablePresentation;
    carrier['verify']                 = require(`./verify.js`)();
    carrier['proof']                  = proof;

    return carrier;
};