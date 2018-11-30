// JavaScript source code mempool.js

const RequestObjectClass = require('./request_object.js');
const MempoolValidObjectClass = require('./mempool_valid_object.js');
const BitcoinMessage = require('bitcoinjs-message');
const MempoolUtil = require('./mempool_helper.js');
const MempoolTimeoutRequestsWindowTime = 5 * 60 * 1000; //aka 5 minutes or 300000 miliseconds
const MempoolValidTimeoutRequestsWindowTime = 30 * 60 * 1000; //aka 30 minutes or 1800000 miliseconds

class memPool {

    /*********************************************************************************************
     * Constructor to create a new memPool, 
     * 
     *********************************************************************************************/

    constructor() {
        this.mempool = [];
        this.mempoolValid = [];
    }

    /********************************************************************************************
     *   addARequestValidation() receives a validation request wallet address and returns 
     *   a response object validationRequestObject. Requests remain active for 5 minutes
    *********************************************************************************************/

    addARequestValidation(validationRequest) {
        for (var i = 0; i <= this.mempool.length - 1; i++) {
            // check if request exists in mempool < 5 minutes old
            if (this.mempool[i].status.walletAddress === validationRequest.address) {

                let timeElapse = (new Date().getTime().toString().slice(0, -3)) - this.mempool[i].status.requestTimeStamp;
                let timeLeft = (MempoolTimeoutRequestsWindowTime / 1000) - timeElapse;
                // timeLeft is the countdown timer for 5 minute request window
                this.mempool[i].status.validationWindow = timeLeft;
                // return the undated validation request with a new time left
                return this.mempool[i].status;
            }
        }
        // Request not found in the mempool create a new validationRequestObject & return object
        let validationRequestObject = new RequestObjectClass.requestObject(validationRequest.address);
        MempoolUtil.addToMemPool(this.mempool, validationRequestObject, MempoolTimeoutRequestsWindowTime);
        return validationRequestObject.status;
    }

     /********************************************************************************************
     *   addARequestByWallet() receives a validation request wallet address and signature and returns 
     *   a mempoolValid object. This will allow the user to next register their star by storing the 
     *   valid request in mempoolValid[]
    *********************************************************************************************/
 
    validateRequestByWallet(validateRequest) {
        // find the requested wallet address in mempool[] 
        let index = MempoolUtil.findObjectByKey(this.mempool, "walletAddress", validateRequest.address);
        // if wallet address was not found in the mempool there is not an active request to verify
        if (index === null) {return [404, "Valid star registry request not found or exceeds 5 minute request window"]};
        try {// test signature using message, wallet address and signature           
            let verifyMessage = BitcoinMessage.verify(this.mempool[index].status.message, this.mempool[index].status.walletAddress, validateRequest.signature);
            if (verifyMessage) {
                // let timestamp = new Date().getTime().toString().slice(0, -3);
                let mempoolValidRequestObject = new MempoolValidObjectClass.MempoolValidObject(validateRequest.address);
                //find the time left in the mempool 5 minute countdown and add to the validate request object
                mempoolValidRequestObject.status.validationWindow = MempoolUtil.findTimeLeftInMempool(this.mempool[index], MempoolTimeoutRequestsWindowTime);
               // this request is valid and it being moved the mempoolValid array and removed from the mempool array
                MempoolUtil.removeValidationRequest(this.mempool, "walletAddress", validateRequest.address);
                MempoolUtil.addToMemPool(this.mempoolValid, mempoolValidRequestObject, MempoolValidTimeoutRequestsWindowTime);
               // this.mempoolValid.push(mempoolValidRequestObject);
               // remove the timeout function from the returned object
                delete mempoolValidRequestObject.timeout;
                // sucess return the requested object
                return [200, mempoolValidRequestObject];
            } else { return [404, "Signature did not verify"] }
            // catch errors from bad signtures do not let program crash
        } catch (err) {
            let errorMessage = "Signature did not verify   " + err;
            return [500, errorMessage];
        }
    }

     /********************************************************************************************
     *   verifyAddressRequest() receives a star registration request. Checks to is if there is
     *   a mempoolValid request and error checks and give the go ahead to add the star to the 
     *   blockchain in the block_controller function postNewStar
    *********************************************************************************************/

    verifyAddressRequest(body) {
        //if there is validated registration request for a given wallet address it will be located in the mempoolValid array
        let index = MempoolUtil.findObjectByKey(this.mempoolValid, "address", body.address);
        // if request is not found in mempoolValid array then not valid and can not register the star
        if (index === null) {
            return [404, "Valid star registry request not found or exceeds 30 minute window", false];
            // ensure request contains star coordinates and a story
        } else if (body.star.ra && body.star.dec && body.star.story) {
            // remove validated request from mempoolValid array as this star is being added to the blockchain
            MempoolUtil.removeValidationRequest(this.mempoolValid, "address", body.address)
            // return status and message, true- flag indicates ok to add to the blockchain
            return [200, "Valid star registry request added to the blockchain", true];
        } else {
            return [400, "Star registry request missing coordinates or story", false]
        }
    }
}

module.exports.memPool = memPool;
