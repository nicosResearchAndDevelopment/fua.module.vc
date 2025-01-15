module.exports = ({
                      'prefix':                prefix = "",
                      'id_lex':                id_lex = "id",
                      'type_lex':              type_lex = "type",
                      'xsdDataTimeStamp':      xsdDataTimeStamp,
                      'typeArrayContainsType': typeArrayContainsType,
                      //
                      'proof':                proof,
                      'VerifiableCredential': VerifiableCredential
                  }) => {

    function serialize({
                           'that':      that,
                           'proof':     proof,
                           'challenge': challenge,
                           'domain':    domain,
                           'to':        to = "json",
                           'result':    result
                       }) {
        try {
            result = (result || {});
            if (to === "turtle") {
                throw new Error();
            } else {
                result['@context']        = that['@context'];
                result[id_lex]            = that[id_lex];
                result[type_lex]          = that[type_lex];
                result[`${prefix}holder`] = that[`${prefix}holder`];
                //
                //result[`${prefix}verifiableCredential`] = that[`${prefix}verifiableCredential`];
                result[`${prefix}verifiableCredential`] = that[`${prefix}verifiableCredential`].map((_vc_) => {
                    return _vc_['issue']({
                        //'proof':          proofs.verifiableCredential_RsaSignature2018,
                        //'to':             "json",
                        //'expirationDate': expirationDate.toISOString(),
                        //'issuanceDate':   issuanceDate.toISOString()
                    });
                });
                result[`${prefix}challenge`]            = that[`${prefix}challenge`];
                result[`${prefix}domain`]               = that[`${prefix}domain`];

                if (proof)
                    result['proof'] = [proof({
                        'node':      result,
                        'challenge': challenge,
                        'domain':    domain
                    })];
            } // switch(to)
            return result;
        } catch (jex) {
            throw jex;
        } // try
    } // serialize()

    class VerifiablePresentation {

        #context = [
            "https://www.w3.org/2018/credentials/v1"
        ];
        #id;
        #type    = ["VerifiablePresentation"];
        //#issuer;
        //
        #holder;
        #verifiableCredential = [];
        #proof                = [];
        #challenge;
        #domain;

        constructor({
                        '@context': context = [],
                        'id':       id,
                        'type':     type = [],
                        //'issuer':               issuer,
                        //
                        'challenge':            challenge,
                        'domain':               domain,
                        'holder':               holder,
                        'verifiableCredential': verifiableCredential,
                        'proof':                __proof
                    }) {

            if (context) {
                if (context[0] === "https://www.w3.org/2018/credentials/v1") {
                    this.#context = context;
                } else {
                    throw new Error(`vc.VerifiablePresentation : first context has to be <https://www.w3.org/2018/credentials/v1>`);
                } // if ()
            } else {
                throw new Error(`vc.VerifiablePresentation : missing context`);
            } // if ()

            if (typeof id === "string") {
                this.#id = id;
            } else {
                throw new Error(`vc.VerifiablePresentation : 'id' has to be string (NOT an array...)`);
            } // if ()

            if (verifiableCredential) {
                this.#verifiableCredential = ((Array.isArray(verifiableCredential)) ? verifiableCredential : [verifiableCredential]).map((_vc_) => {
                    return new VerifiableCredential(_vc_);
                });
                if (this.#verifiableCredential.length < 1) {
                    throw new Error(`vc.VerifiablePresentation : MUST include 'verifiableCredential'`);
                }
            } else {
                throw new Error(`vc.VerifiablePresentation : MUST include 'verifiableCredential'`);
            } // if ()

            if (__proof) {
                this.#proof = ((Array.isArray(__proof)) ? __proof : [__proof]).map((_proof_) => {
                    return proof(_proof_);
                });
                if (this.#verifiableCredential.lenght < 1) {
                    throw new Error(`vc.VerifiablePresentation : MUST include 'proof'`);
                }
            } else {
                throw new Error(`vc.VerifiablePresentation : MUST include 'proof'`);
            } // if ()

            if (Array.isArray(type)) {
                if (typeArrayContainsType(type, "VerifiablePresentation")) {
                    if (type.length > 1) {
                        this.#type = type;
                    } else {
                        throw new Error(`vc.VerifiablePresentation : MUST be 'VerifiablePresentation' plus specific type`);
                    } // if ()
                } else {
                    throw new Error(`vc.VerifiablePresentation : MUST be 'VerifiablePresentation' plus specific type`);
                } //if ()
            } else {
                throw new Error(`vc.VerifiablePresentation : 'type' MUST be one ore more URIs`);
            } // if ()

            //this.#issuer            = issuer;
            //
            this.#holder = holder;



            this.#challenge = challenge;
            this.#domain    = domain;

            Object.defineProperties(this, {
                '@context': {value: this.#context},
                [id_lex]:   {value: this.#id},
                [type_lex]: {value: this.#type},
                //'issuer':            {value: this.#issuer},
                //
                'proof':                {value: this.#proof},
                'holder':               {value: this.#holder},
                'verifiableCredential': {value: this.#verifiableCredential},
                //
                'toJSON': {
                    enumerable: false,
                    value:      () => {
                        return serialize({'that': this, 'proof': undefined, 'to': "json", 'result': undefined});
                    }
                }
                //, 'issue':              {
                //    enumerable: false,
                //    value:      ({
                //                     'proof': proof, 'to': to
                //                 }) => {
                //        return serialize({'that': this, 'proof': proof, 'to': to, 'result': undefined});
                //    }
                //}
            });

            if (this['__proto__']['constructor']['name'] === "VerifiablePresentation") {
                Object.seal(this);
            } // if ()

        } // constructor()

        issue({
                  'proof':     proof,
                  'challenge': challenge,
                  'domain':    domain,
                  'to':        to
              }) {
            return serialize({
                'that':      this,
                'proof':     (proof || this.#proof),
                'challenge': (challenge || this.#challenge),
                'domain':    (domain || this.#domain),
                'to':        to,
                'result':    undefined
            });
        }

    } // class VerifiablePresentation

    return VerifiablePresentation;

};