module.exports = ({
                      'prefix':           prefix = "", // sec
                      'id_lex':           id_lex = "id",
                      'type_lex':         type_lex = "type",
                      'xsdDataTimeStamp': xsdDataTimeStamp
                  }) => {

    function proof({
                       'node':               node,
                       'type':               type,
                       'proofPurpose':       proofPurpose = "TODO",
                       'challenge':          challenge,
                       'domain':             domain,
                       'verificationMethod': verificationMethod = "TODO",
                       'tokenType':          tokenType
                   }) {

        let token = "TODO: produce token";

        switch (tokenType) {
            case "jws":
                token = "TODO: produce 'jws' token";
                break; // jws
            default:
                //throw new Error(`unkown proof tokenType <${tokenType}>`);
                break; // default
        } // switch(tokenType)

        let _proof = {
            [type_lex]:                      type,
            [`${prefix}created`]:            xsdDataTimeStamp(),
            [`${prefix}proofPurpose`]:       proofPurpose,
            [`${prefix}challenge`]:          challenge,
            [`${prefix}domain`]:             domain,
            [`${prefix}verificationMethod`]: verificationMethod,
            [`${prefix}${tokenType}`]:       token
        };
        return _proof;
    } // proof

    Object.defineProperties(proof, {
        'factory': {
            value: ({'type': type, 'tokenType': tokenType}) => {
                return ({
                            'node':         node,
                            'challenge':    challenge,
                            'domain':       domain,
                            'proofPurpose': proofPurpose
                        }) => {
                    return proof({
                        'node':         node,
                        'type':         type,
                        'challenge':    challenge,
                        'domain':       domain,
                        'proofPurpose': proofPurpose,
                        'tokenType':    tokenType
                    });
                }; // return
            } // value
        } // factory
    }); // Object.defineProperties(proof)

    return proof;

};