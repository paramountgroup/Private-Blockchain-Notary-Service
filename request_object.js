// JavaScript source code request_object.js


/******************************************************************
*  Class with a constructor for requestObject			   
*******************************************************************/

class requestObject {
    constructor(address) {
        this.timeout = "";
        this.status = {
            walletAddress: address,
            requestTimeStamp: (new Date().getTime().toString().slice(0, -3)),
            message: "19xaiMqayaNrn3x7AjV5cU4Mk5f5prRVpL:1541605128:starRegistry",
            validationWindow: 300,
        };
    }
}

module.exports.requestObject = requestObject;
