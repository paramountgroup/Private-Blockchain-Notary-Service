// JavaScript source code mempool.js

const RequestObjectClass = require('./request_object.js');
const MempoolValidObjectClass = require('./mempool_valid_object.js');
const bitcoinMessage = require('bitcoinjs-message'); 
const TimeoutRequestsWindowTime = 5 * 60 * 1000; //aka 5 minutes or 50000 miliseconds
const mempoolUtil = require('./mempool_helper.js');

class memPool {

    /*********************************************************************************************
     * Constructor to create a new memPool, 
     * 
     *********************************************************************************************/

    constructor() {

        this.mempool = [];
        this.mempoolValid = [];
    }


    /********************************************************************************
     *   addARequestValidation() receives a validation request wallet address and returns 
     *   a response object validationRequestObject. Requests remain active for 5 minutes
    *********************************************************************************/

    addARequestValidation(validationRequest) {

        console.log(" in addARequestValidation validationRequest.address is: " + validationRequest.address);

        console.log(" in addARequestValidation this.mempool.length before for loop is: " + this.mempool.length);
        for (var i = 0; i <= this.mempool.length - 1; i++) {
            console.log(" in addARequestValidation in for loop this.mempool.length is: " + this.mempool.length + " i is: " + i);
            // check if request exists in mempool < 5 minutes old
            console.log(" in addARequestValidation in for loop this.mempool[i].address is: " + this.mempool[i].walletAddress + " i is: " + i);
            console.log(" in addARequestValidation in for loop validationRequest.address is: " + validationRequest.address);
            if (this.mempool[i].walletAddress === validationRequest.address) {
                console.log("in addARequestValidation for loop checking if request exists i is: " + i);
                let timeElapse = (new Date().getTime().toString().slice(0, -3)) - this.mempool[i].requestTimeStamp;
                console.log("in addARequestValidation timeElase is: " + timeElapse);
                let timeLeft = (TimeoutRequestsWindowTime / 1000) - timeElapse;
                console.log("in addARequestValidation timeLeft is: " + timeLeft);

                this.mempool[i].validationWindow = timeLeft;
                console.log(" in addARequestValidation mempool[i].validationWindow is: " + this.mempool[i].validationWindow);

                return this.mempool[i];
            }

        }
        // Request not found in the mempool create a new validationRequestObject & return object
        let validationRequestObject = new RequestObjectClass.requestObject(validationRequest.address);
        this.addToMemPool(validationRequestObject);
        return validationRequestObject;
    }

    validateRequestByWallet(validateRequest) {
        const message = "19xaiMqayaNrn3x7AjV5cU4Mk5f5prRVpL:1541605128:starRegistry"
        console.log(" in validateRequestByWallet validateRequest.address is: " + validateRequest.address);
        console.log(" in validateRequestByWallet this.mempool[0].walletAddress is: " + this.mempool[0].walletAddress);
      //  let key = "walletAddress"
        let index = mempoolUtil.findObjectByKey(this.mempool, "walletAddress", validateRequest.address)
        console.log("in validateRequestByWallet and mempool index of request is: " + index);
        
        
        if (index === null) {
           // console.log(" in validateRequestByWallet and !index is: " + (!index));
            return [404, "Valid star registry request not found or exceeds 5 minute request window"]   
        };

        console.log("in validateRequestByWallet and this.mempool[index].message is: " + this.mempool[index].message);
        console.log("in validateRequestByWallet and this.mempool[index].walletAddress is:  " + this.mempool[index].walletAddress);
        console.log("in validateRequestByWallet and validateRequest.signature is: " + validateRequest.signature);

        if (bitcoinMessage.verify(this.mempool[index].message, this.mempool[index].walletAddress, validateRequest.signature)) {
           // let timestamp = new Date().getTime().toString().slice(0, -3);
            let mempoolValidRequestObject = new MempoolValidObjectClass.MempoolValidObject(validateRequest.address);
            mempoolValidRequestObject.status.validationWindow = mempoolUtil.findTimeLeftInMempool(this.mempool[index], TimeoutRequestsWindowTime);
            this.removeValidationRequest(validateRequest.address, this.mempool);
            this.mempoolValid.push(mempoolValidRequestObject);
            
            return [200, mempoolValidRequestObject];
        } else {
            return [404, "Signature did not verify"];
        }
    }

    addToMemPool(validationRequestObject) {

        
        let self = this;
        validationRequestObject.timeout = setTimeout(function () { self.removeValidationRequest(validationRequestObject.walletAddress, self.mempool) }, TimeoutRequestsWindowTime);
        console.log("in addToMemPool and validationRequestObject is: " + validationRequestObject);
        this.mempool.push(validationRequestObject);
    }

    removeValidationRequest(walletAddress, array) {
        console.log("in removeValidationRequest walletAddress is: " + walletAddress);
        array.splice(mempoolUtil.findObjectByKey(this.mempool, "walletAddress", "", walletAddress), 1);
        console.log(" in removeValidationRequest just removed an object that timed out mempool is: " + this.mempool);
        //this.mempool.splice(this.mempool.walletAddress.indexOf(walletAddress), 1);

    }

    verifyAddressRequest(body) {
        //getting error here
        //console.log("in verifyAddressRequest this.mempoolValid[0].status.address: " + this.mempoolValid[0].status.address);
        let index = mempoolUtil.findObjectByKey(this.mempoolValid, "status", "address", body.address);
        console.log(" in verifyAddressRequest index is: " + index);
        console.log(" in verifyAddressRequest this.mempoolValid is: " + JSON.stringify(this.mempoolValid));
        if (index === null) {
            // console.log(" in validateRequestByWallet and !index is: " + (!index));
            return [404, "Valid star registry request not found or exceeds 5 minute request window", false];
        } else if (body.star.ra && body.star.dec && body.star.story) {
            this.removeValidationRequest(body.address, this.mempoolValid)
            return [200, "Valid star registry request add to blockchain", true];
        } else {
            return [400, "Star registry request missing coordinates or story", false]
        }

    }
}

module.exports.memPool = memPool;
