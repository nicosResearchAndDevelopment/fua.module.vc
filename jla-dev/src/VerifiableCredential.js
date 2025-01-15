module.exports = ({
                      'prefix':                prefix = "",
                      'id_lex':                id_lex = "id",
                      'type_lex':              type_lex = "type",
                      'xsdDataTimeStamp':      xsdDataTimeStamp,
                      'typeArrayContainsType': typeArrayContainsType,
                      // alpha
                      'CredentialSchema': CredentialSchema,
                      'proof':            proof,
                      'Issuer':           Issuer,
                      'RefreshService':   RefreshService
                  }) => {

    function serialize({
                           'that':           that, 'proof': proof,
                           'issuanceDate':   issuanceDate = xsdDataTimeStamp(),
                           'expirationDate': expirationDate = undefined,
                           'to':             to = "json",
                           'result':         result
                       }) {
        try {
            result = (result || {});
            if (to === "turtle") {
                throw new Error();
            } else {
                result['@context'] = that['@context'];
                result[id_lex]     = that[id_lex];
                result[type_lex]   = that[type_lex];
                //REM: both are correct
                //'issuer':            that['issuer'].toJSON()[id_lex],         // REM: jwt.iss
                // TODO: hier verbirgt sich die Diskussion string only?!? >>> VC.SPEC durchsuchen!!!
                result[`${prefix}issuer`]       = ((typeof that['issuer'] === "string") ? that['issuer'] : that['issuer'].toJSON());
                //REM: next version :: 'validFrom ':      issuanceDate,         // REM: jwt.nbf
                result[`${prefix}issuanceDate`] = issuanceDate;                 // REM: jwt.nbf
                //REM: next version :: 'validUntil':      expirationDate,       // REM: jwt.exp
                result[`${prefix}expirationDate`]    = expirationDate;          // REM: jwt.exp
                result[`${prefix}nonTransferable`]   = that['nonTransferable'];
                result[`${prefix}credentialSubject`] = that['credentialSubject'];
                if (that[`${prefix}credentialStatus`]) {
                    result[`${prefix}credentialStatus`] = that[`${prefix}credentialStatus`];
                } // if ()
                if (that[`${prefix}evidence`]) {
                    result[`${prefix}evidence`] = that[`${prefix}evidence`].map((_ev_) => {
                        return _ev_;
                    });
                } // if ()

                result[`${prefix}termsOfUse`] = that[`${prefix}termsOfUse`];
                //
                // TODO: >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
                //
                //'credentialSchema':             {
                //    'id':   "https://example.org/examples/degree.json",
                //    'type': "JsonSchemaValidator2018"
                //},
                //'refreshService':               {
                //    'id':   "https://example.edu/refresh/3732",
                //    'type': "ManualRefreshService2018"
                //},

                if (that[`${prefix}refreshService`]) {
                    result[`${prefix}refreshService`] = that[`${prefix}refreshService`].map((_rs_) => {
                        return _rs_['issue']({
                            //'proof':          proofs.verifiableCredential_RsaSignature2018,
                            //'to':             "json",
                            //'expirationDate': expirationDate.toISOString(),
                            //'issuanceDate':   issuanceDate.toISOString()
                        });
                    });
                } // if ()

                //'credentialStatus':             "TODO", // {'id': ""}
                //"evidence":                     [{
                //    'id':               "https://example.edu/evidence/f2aeec97-fc0d-42bf-8ca7-0548192d4231",
                //    'type':             ["DocumentVerification"],
                //    'verifier':         "https://example.edu/issuers/14",
                //    'evidenceDocument': "DriversLicense",
                //    'subjectPresence':  "Physical",
                //    'documentPresence': "Physical"
                //}, {
                //    'id':               "https://example.edu/evidence/f2aeec97-fc0d-42bf-8ca7-0548192dxyzab",
                //    'type':             ["SupportingActivity"],
                //    'verifier':         "https://example.edu/issuers/14",
                //    'evidenceDocument': "Fluid Dynamics Focus",
                //    'subjectPresence':  "Digital",
                //    'documentPresence': "Digital"
                //}]
                // TODO: <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
                //result                               = {
                //    '@context':                     that['@context'],
                //    [id_lex]:                       that[id_lex],
                //    [type_lex]:                     that[type_lex],
                //    //REM: both are correct
                //    //'issuer':            that['issuer'].toJSON()[id_lex],         // REM: jwt.iss
                //    [`${prefix}issuer`]:            that['issuer'].toJSON(),        // REM: jwt.iss
                //    //REM: next version :: 'validFrom ':      issuanceDate,         // REM: jwt.nbf
                //    [`${prefix}issuanceDate`]:      issuanceDate,                   // REM: jwt.nbf
                //    //REM: next version :: 'validUntil':      expirationDate,       // REM: jwt.exp
                //    [`${prefix}expirationDate`]:    expirationDate,                 // REM: jwt.exp
                //    [`${prefix}nonTransferable`]:   that['nonTransferable'],
                //    [`${prefix}credentialSubject`]: that['credentialSubject'],
                //    [`${prefix}termsOfUse`]:        that[`${prefix}termsOfUse`]
                //
                //};

                if (that[`${prefix}credentialSchema`]) {
                    if (that[`${prefix}credentialSchema`]['issue'])
                        result[`${prefix}credentialSchema`] = that[`${prefix}credentialSchema`]['issue']({'to': to});
                    result[`${prefix}credentialSchema`] = that[`${prefix}credentialSchema`];
                } // if ()

                if (proof)
                    result['proof'] = [proof(result)];

            } // switch(to)
            return result;
        } catch (jex) {
            throw jex;
        } // try
    } // serialize()

    const
        uri_regex     = /\w+:(\/?\/?)[^\s]+/,
        RFC3339_regex = new RegExp('^(\\d{4})-(0[1-9]|1[0-2])-' +
            '(0[1-9]|[12][0-9]|3[01])T([01][0-9]|2[0-3]):' +
            '([0-5][0-9]):([0-5][0-9]|60)' +
            '(\\.[0-9]+)?(Z|(\\+|-)([01][0-9]|2[0-3]):' +
            '([0-5][0-9]))$', 'i')
    ;

    class VerifiableCredential {

        #context         = [
            "https://www.w3.org/2018/credentials/v1"
        ];
        #id;
        #type            = ["VerifiableCredential"];
        #issuer;
        #issuanceDate    = undefined;
        #expirationDate  = undefined;
        //
        #nonTransferable = true;
        #credentialSubject;
        #credentialSchema;
        #evidence;
        #refreshService;
        #credentialStatus;
        #termsOfUse;
        //
        #verified        = false;

        constructor({
                        '@context':       context = [],
                        'id':             id,
                        'type':           type = [],
                        'issuer':         issuer,
                        'issuanceDate':   issuanceDate,
                        'expirationDate': expirationDate,
                        // TODO: 'expirationDuration': expirationDuration, // REM: from issuanceDate
                        //
                        //'challenge':         challenge,
                        //'domain':            domain,
                        // alpha
                        'credentialSubject': credentialSubject,
                        'credentialSchema':  credentialSchema,
                        'evidence':          evidence,
                        'nonTransferable':   nonTransferable = true, // TODO: check, if default?!?
                        'termsOfUse':        termsOfUse,
                        'refreshService':    refreshService,
                        'credentialStatus':  credentialStatus
                    }) {

            if (context) {
                if (context[0] === "https://www.w3.org/2018/credentials/v1") {
                    this.#context = context;
                } else {
                    throw new Error(`vc.VerifiableCredential : first context has to be <https://www.w3.org/2018/credentials/v1>`);
                } // if ()
            } else {
                throw new Error(`vc.VerifiableCredential : missing context`);
            } // if ()

            if (typeof id === "string") {
                this.#id = id;
            } else {
                throw new Error(`vc.VerifiableCredential : 'id' has to be string (NOT an array...)`);
            } // if ()

            if (Array.isArray(type)) {
                if (typeArrayContainsType(type, "VerifiableCredential")) {
                    if (type.length > 1) {
                        this.#type = type;
                    } else {
                        throw new Error(`vc.VerifiableCredential : MUST be 'VerifiableCredential' plus specific type`);
                    } // if ()
                } else {
                    throw new Error(`vc.VerifiableCredential : MUST be 'VerifiableCredential' plus specific type`);
                } //if ()
            } else {
                throw new Error(`vc.VerifiableCredential : 'type' MUST be one ore more URIs`);
            } // if ()

            if (issuer) { // REM: jwt.iss

                // TODO: ist der issuer immer 'nur' ein string, das ist hier die Frage
                // TODO: ...sollte er immer in {id:""} translatiert werden (was NICHT digital bazar konform wäre)?
                // TODO: is this a good idea?!? has to hardened against SPEC
                // TODO: this.#issuer = new Issuer((typeof issuer === "string") ? {'id': issuer} : issuer);

                if (typeof issuer === "string") {
                    // TODO: if (regex)
                    if (uri_regex.exec(issuer)) {
                        this.#issuer = issuer;
                    } else {
                        throw new Error(`vc.VerifiableCredential : MUST be a single URI`);
                    } // if ()
                } else {
                    if (Array.isArray(issuer)) {
                        throw new Error(`vc.VerifiableCredential : MUST be a single URI`);
                    } else {
                        throw new Error(`vc.VerifiableCredential : MUST be present`);
                    } // if ()
                } // if()
            } else {
                throw new Error(`vc.VerifiableCredential : MUST be present`);
            } // if ()

            if (issuanceDate !== undefined) {
                if (typeof issuanceDate === "string") {
                    if (RFC3339_regex.exec(issuanceDate)) {
                        this.#issuanceDate = issuanceDate;
                    } else {
                        throw new Error(`vc.VerifiableCredential : MUST be an RFC3339 datetime`);
                    } // if ()
                } else {
                    throw new Error(`vc.VerifiableCredential : MUST be string`);
                } // if ()
            } // if ()

            if (expirationDate !== undefined) {
                if (typeof expirationDate === "string") {
                    if (RFC3339_regex.exec(expirationDate)) {
                        this.#expirationDate = expirationDate;
                    } else {
                        throw new Error(`vc.VerifiableCredential : MUST be an RFC3339 datetime`);
                    } // if ()
                } else {
                    throw new Error(`vc.VerifiableCredential : MUST be string`);
                } // if ()
            } // if ()

            if (typeof nonTransferable !== "boolean")
                throw new Error(`'nonTransferable' has to be boolean`);

            this.#nonTransferable = nonTransferable;

            if (credentialSubject) {
                if (credentialSubject['id']) { // TODO: AND exports.uri_regex = /\w+:(\/?\/?)[^\s]+/;
                    //this.#credentialSubject = {'___id___': "asdf"}; // credentialSubject;
                    this.#credentialSubject = credentialSubject;
                } else {
                    throw new Error(`vc.VerifiableCredential : credentialSubject MUST have an 'id'`);
                } // if ()
            } else {
                throw new Error(`vc.VerifiableCredential : credentialSubject MUST be present`);
            } // if ()

            if (refreshService) {
                this.#refreshService = ((Array.isArray(refreshService)) ? refreshService : [refreshService]).map((_rs_) => {
                    return new RefreshService(_rs_);
                });
            } // if ()

            if (evidence) {
                evidence = [].concat(evidence);
                evidence.map((e) => {
                    if (!e['id']) { // TODO: AND exports.uri_regex = /\w+:(\/?\/?)[^\s]+/;
                        throw new Error(`vc.VerifiableCredential : evidence MUST have an 'id'`);
                    } // if ()
                    if ([].concat(e['type']).length < 1) { // TODO: AND exports.uri_regex = /\w+:(\/?\/?)[^\s]+/;
                        throw new Error(`vc.VerifiableCredential : evidence MUST have at least one 'type'`);
                    } // if ()
                });
                this.#evidence = evidence;
            } // if ()

            if (credentialStatus) {
                if (credentialStatus['id']) { // TODO: AND exports.uri_regex = /\w+:(\/?\/?)[^\s]+/;
                    //this.#credentialSubject = {'___id___': "asdf"}; // credentialSubject;

                    if (credentialStatus['type']) { // TODO: AND exports.uri_regex = /\w+:(\/?\/?)[^\s]+/;
                        //this.#credentialSubject = {'___id___': "asdf"}; // credentialSubject;
                        this.#credentialStatus = credentialStatus;
                    } else {
                        throw new Error(`vc.VerifiableCredential : credentialStatus MUST have an 'id'`);
                    } // if ()

                    this.#credentialStatus = credentialStatus;
                } else {
                    throw new Error(`vc.VerifiableCredential : credentialStatus MUST have an 'id'`);
                } // if ()
            } else {
                throw new Error(`vc.VerifiableCredential : credentialStatus MUST be present`);
            } // if ()

            this.#credentialSchema = credentialSchema;
            this.#termsOfUse       = termsOfUse;

            Object.defineProperties(this, {
                '@context': {value: this.#context},
                [id_lex]:   {value: this.#id},
                [type_lex]: {value: this.#type},
                'issuer':   {value: this.#issuer},
                //
                'nonTransferable':   {value: this.#nonTransferable},
                'credentialSubject': {value: this.#credentialSubject},
                'credentialSchema':  {value: this.#credentialSchema},
                'credentialStatus':  {value: this.#credentialStatus},
                'evidence':          {value: this.#evidence},
                'termsOfUse':        {value: this.#termsOfUse},
                'refreshService':    {value: this.#refreshService},
                //
                'setTermsOfUse': {
                    enumerabel: false,
                    value:      (termsOfUse) => {
                        this.#termsOfUse = termsOfUse;
                    }
                },
                //
                'toJSON': {
                    enumerable: false,
                    value:      () => {
                        return serialize({'that': this, 'proof': undefined, 'to': "json"});
                    }
                }
                //, 'issue':           {
                //    enumerable: false,
                //    value:      ({
                //                     'proof':          proof,
                //                     'issuanceDate':   issuanceDate = xsdDataTimeStamp(),
                //                     'expirationDate': expirationDate,
                //                     'to':             to
                //                 }) => {
                //        return serialize({
                //            'that':           this, 'proof': proof,
                //            'issuanceDate':   issuanceDate,
                //            'expirationDate': expirationDate,
                //            'to':             to
                //        });
                //    }
                //}
                ,
                'verified': {
                    enumerable: false,
                    value:      () => {
                        return this.#verified;
                    }
                },
                'verify':   {
                    enumerable: false,
                    value:      () => {
                        return new Promise((resolve, reject) => {
                            try {
                                this.#verified = false;
                                resolve();
                            } catch (jex) {
                                this.#verified = false;
                                reject(jex);
                            }
                        }); // rnP
                    }
                }
            });

            if (this['__proto__']['constructor']['name'] === "VerifiableCredential") {
                Object.seal(this);
            } // if ()

        } // constructor()

        issue({
                  'issuanceDate':   issuanceDate = (this.#issuanceDate || xsdDataTimeStamp()),
                  'expirationDate': expirationDate,
                  'proof':          proof,
                  'to':             to
              }) {
            return serialize({
                'that':           this,
                'issuanceDate':   issuanceDate,
                'expirationDate': expirationDate,
                'proof':          proof,
                'to':             to, 'result': undefined
            });
        }

    } // class VerifiableCredential

    return VerifiableCredential;

};