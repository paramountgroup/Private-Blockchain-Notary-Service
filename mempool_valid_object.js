// JavaScript source code mempoolValidObject.js



/******************************************************************
*  Class with a constructor for MempoolValidObject			   
*******************************************************************/

class MempoolValidObject {
    constructor(walletAddress) {
        this.registerStar = true;
        this.status = {
            address: walletAddress,
            requestTimeStamp: (new Date().getTime().toString().slice(0, -3)),
            message: "19xaiMqayaNrn3x7AjV5cU4Mk5f5prRVpL:1541605128:starRegistry",
            validationWindow: "",
            messageSignature: "valid"
        };
    }
}

module.exports.MempoolValidObject = MempoolValidObject;

