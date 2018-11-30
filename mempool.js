// JavaScript source code mempool.js

const RequestObjectClass = require('./request_object.js');
const MempoolValidObjectClass = require('./mempool_valid_object.js');
const bitcoinMessage = require('bitcoinjs-message');
const TimeoutRequestsWindowTime = 1 * 60 * 1000; //aka 5 minutes or 300000 miliseconds
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
        for (var i = 0; i <= this.mempool.length - 1; i++) {
            // check if request exists in mempool < 5 minutes old
            if (this.mempool[i].status.walletAddress === validationRequest.address) {

                let timeElapse = (new Date().getTime().toString().slice(0, -3)) - this.mempool[i].status.requestTimeStamp;
                let timeLeft = (TimeoutRequestsWindowTime / 1000) - timeElapse;
                // timeLeft is the countdown timer for 5 minute request window
                this.mempool[i].status.validationWindow = timeLeft;
                // return the undated validation request with a new time left
                return this.mempool[i].status;
            }
        }
        // Request not found in the mempool create a new validationRequestObject & return object
        let validationRequestObject = new RequestObjectClass.requestObject(validationRequest.address);
        this.addToMemPool(validationRequestObject);
        return validationRequestObject.status;
    }

    /********************************************************************************
    *   addToMemPool() receives a validationRequestObject and stores it in the mempool
    *   array. These objects have a timeout that will remove them in 5 minutes  
   *********************************************************************************/

    addToMemPool(validationRequestObject) {
        let self = this;
        console.log("in addToMemPool and validationRequestObject is: " + JSON.stringify(validationRequestObject));
        //this validationRequestObject will self destruct after 5 minutes. The timeout function removes it from the mempool array after 5 min
        validationRequestObject.timeout = setTimeout(function () { self.removeValidationRequest(self.mempool, "walletAddress", validationRequestObject.status.walletAddress) }, TimeoutRequestsWindowTime);
        // add object with timeout to mempool array
        this.mempool.push(validationRequestObject);
        console.log(" in addToMemPool and JSON.strigify(this.mempool[0].status) is: " + JSON.stringify(this.mempool[0].status));
        console.log(" in addToMemPool and this.mempool is: " + this.mempool);
    }

    validateRequestByWallet(validateRequest) {

        console.log(" in validateRequestByWallet validateRequest.address is: " + validateRequest.address);
        //console.log(" in validateRequestByWallet this.mempool is: " + JSON.stringify(this.mempool.status));
        //  let key = "walletAddress"
        let index = mempoolUtil.findObjectByKey(this.mempool, "walletAddress", validateRequest.address)
        console.log("in validateRequestByWallet and mempool index of request is: " + index);


        if (index === null) {
            // console.log(" in validateRequestByWallet and !index is: " + (!index));
            return [404, "Valid star registry request not found or exceeds 5 minute request window"]
        };

        try {// test signature using message, wallet address and signature
            
            let verifyMessage = bitcoinMessage.verify(this.mempool[index].status.message, this.mempool[index].status.walletAddress, validateRequest.signature);
            if (verifyMessage) {
                // let timestamp = new Date().getTime().toString().slice(0, -3);
                let mempoolValidRequestObject = new MempoolValidObjectClass.MempoolValidObject(validateRequest.address);
                mempoolValidRequestObject.status.validationWindow = mempoolUtil.findTimeLeftInMempool(this.mempool[index], TimeoutRequestsWindowTime);
                console.log("in validateRequestByWallet removing form mempool the address that is now verified:  " + this.mempool[index]);
                this.removeValidationRequest(this.mempool, "walletAddress", validateRequest.address);
                console.log("in validateRequestByWallet memValidRequestObject going into mempoolValid is:  " + JSON.stringify(mempoolValidRequestObject));
                this.mempoolValid.push(mempoolValidRequestObject);
                console.log("in validateRequestByWallet memValidRequestObject with new verified object mempoolValid is:  " + this.mempoolValid);
                return [200, mempoolValidRequestObject];
            } else { return [404, "Signature did not verify"] }

            // catch errors from bad signtures do not let program crash
        } catch (err) {
            let errorMessage = "Signature did not verify   " + err;
            return [500, errorMessage];
        }
    }



    

    verifyAddressRequest(body) {
        console.log("in verifyAddressRequest mempoolValid is:  " + this.mempoolValid);
        //if there is validated registration request for a given wallet address it will be located in the mempoolValid array
        let index = mempoolUtil.findObjectByKey(this.mempoolValid, "address", body.address);
        console.log("in verifyAddressRequest index is:  " + index);
        // if request is not found in mempoolValid array then not valid and can not register the star
        if (index === null) {
            return [404, "Valid star registry request not found", false];
            // ensure request contains star coordinates and a story
        } else if (body.star.ra && body.star.dec && body.star.story) {
            // remove validated request from mempoolValid array as this star is being added to the blockchain
            this.removeValidationRequest(this.mempoolValid, "address", body.address)
            return [200, "Valid star registry request added to the blockchain", true];
        } else {
            return [400, "Star registry request missing coordinates or story", false]
        }
    }

    removeValidationRequest(array, key, value) {
        console.log("in removeValidationRequest value is: " + value);
        console.log(" in removeValidationRequest just before an object array is removed: " + array);
        array.splice(mempoolUtil.findObjectByKey(array, key, value), 1);
        console.log(" in removeValidationRequest just after removed an object array is: " + array);
        //this.mempool.splice(this.mempool.walletAddress.indexOf(walletAddress), 1);

    }
}

module.exports.memPool = memPool;
