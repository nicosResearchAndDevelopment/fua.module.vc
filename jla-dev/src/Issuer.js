module.exports = ({
                      'prefix':           prefix = "",
                      'id_lex':           id_lex = "id",
                      'type_lex':         type_lex = "type",
                      'xsdDataTimeStamp': xsdDataTimeStamp
                  }) => {

    function serialize({'that': that, 'proof': proof, 'to': to = "json", 'result': result}) {
        try {
            result = (result || {});
            if (to === "turtle") {
                throw new Error();
            } else {
                result[id_lex] = that['id'];
            } // switch(to)
            return result;
        } catch (jex) {
            throw jex;
        } // try
    } // serialize()

    class Issuer {

        #id;
        #type = ["foaf:Agent"];

        constructor({
                        'id':   id,
                        'type': type = []
                    }) {

            this.#id   = id;
            this.#type = this.#type.concat(type);

            Object.defineProperties(this, {
                [id_lex]:   {value: this.#id},
                [type_lex]: {value: this.#type},
                'toJSON':   {
                    value: () => {
                        return serialize({'that': this, 'proof': undefined, 'to': "json"});
                    }
                },
                'toTurtle': {
                    value: () => {
                        return serialize({'that': this, 'proof': undefined, 'to': "turtle"});
                    }
                },
                'issue':    {
                    enumerable: false,
                    value:      ({'proof': proof, 'to': to}) => {
                        return serialize({'that': this, 'proof': proof, 'to': to, 'result': undefined});
                    }
                }
            });

            if (this['__proto__']['constructor']['name'] === "Issuer") {
                Object.seal(this);
            } // if ()

        } // constructor()

    } // class Issuer

    return Issuer;

};