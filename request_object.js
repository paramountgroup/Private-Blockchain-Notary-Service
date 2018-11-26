// JavaScript source code request_object.js


/******************************************************************
*  Class with a constructor for requestObject			   
*******************************************************************/

class requestObject {
    constructor(address) {
        this.walletAddress = address;
        this.requestTimeStamp = (new Date().getTime().toString().slice(0, -3));
        this.message = "19xaiMqayaNrn3x7AjV5cU4Mk5f5prRVpL:1541605128:starRegistry";
        this.validationWindow = 300;
        this.timeout = ""
    }
}

module.exports.requestObject = requestObject;
