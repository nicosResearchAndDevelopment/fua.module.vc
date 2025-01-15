module.exports = ({
                      'prefix':               prefix = "",
                      'id_lex':               id_lex = "id",
                      'type_lex':             type_lex = "type",
                      'xsdDataTimeStamp':     xsdDataTimeStamp,
                      //
                      'VerifiableCredential': VerifiableCredential
                  }) => {

    function serialize({'that': that, 'to': to = "json", 'result': result}) {
        try {
            result = (result || {});
            if (to === "turtle") {
                throw new Error();
                //} else {
                //    result[id_lex]   = that['id'];
                //    result[type_lex] = that['type'];
            } // if ()
            return result;
        } catch (jex) {
            throw jex;
        } // try
    } // serialize()

    class DisputeCredential extends VerifiableCredential {

        //#id;
        //#type = [];

        constructor({
                        '@context':          context = [],
                        'id':                id,
                        'type':              type = [],
                        'issuer':            issuer,
                        //
                        'nonTransferable':   nonTransferable = true,
                        'credentialSubject': credentialSubject,
                        'credentialSchema':  credentialSchema,
                        'termsOfUse':        termsOfUse
                        // DisputeCredential specific
                    }) {

            super({
                '@context':          context,
                'id':                id,
                'type':              ((type) ? type.concat("DisputeCredential") : ["DisputeCredential"]),
                'issuer':            issuer,
                //
                'nonTransferable':   nonTransferable,
                'credentialSubject': credentialSubject,
                'credentialSchema':  credentialSchema,
                'termsOfUse':        termsOfUse
            });

            //this.#id   = id;
            //this.#type = this.#type.concat(type);

            //Object.defineProperties(this, {
            //    //[id_lex]:   {value: this.#id},
            //    //[type_lex]: {value: this.#type},
            //    //'toJSON':   {
            //    //    value: () => {
            //    //        return serialize({'that': this, 'proof': undefined, 'to': "json"});
            //    //    }
            //    //},
            //    //'toTurtle': {
            //    //    value: () => {
            //    //        return serialize({'that': this, 'proof': undefined, 'to': "turtle"});
            //    //    }
            //    //},
            //    'issue': {
            //        enumerable: false,
            //        value:      ({'to': to}) => {
            //            return super.serialize({'that': this, 'to': to, 'result': undefined}).then((result) => {
            //                serialize({'that': this, 'to': to, 'result': result});
            //            });
            //        }
            //    }
            //});

            if (this['__proto__']['constructor']['name'] === "DisputeCredential") {
                Object.seal(this);
            } // if ()

        } // constructor()

        issue({
                  'issuanceDate':   issuanceDate = xsdDataTimeStamp(),
                  'expirationDate': expirationDate,
                  'proof':          proof,
                  'to':             to
              }) {

            return super.issue({
                'that':           this,
                'issuanceDate':   issuanceDate,
                'expirationDate': expirationDate,
                'proof':          proof,
                'to':             to,
                'result':         serialize({
                    'that': this, 'to': to, 'result': undefined
                })
            });

        }

    } // class DisputeCredential

    return DisputeCredential;

};