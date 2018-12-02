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
            message: "TODO add message",
            validationWindow: 300,
        };
    }
}

module.exports.requestObject = requestObject;
