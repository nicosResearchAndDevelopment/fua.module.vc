module.exports = () => {

    function verify() {
        return new Promise((resolve, reject) => {
            try {
                let result = false;
                resolve(result);
            } catch (jex) {
                reject(jex);
            } // try
        }); // rnP
    } // verify

    //Object.defineProperties(proof, {
    //    'factory': {
    //        value: ({'type': type}) => {
    //            return (node) => {
    //                return proof({'node': node, 'type': type});
    //            }; // return
    //        } // value
    //    } // factory
    //}); // Object.defineProperties(proof)

    return verify;

};