// JavaScript source code mempool.js

const RequestObjectClass = require('./request_object.js');
const TimeoutRequestsWindowTime = 5 * 60 * 1000;//aka 5 minutes or 50000 miliseconds

class memPool {

    /*********************************************************************************************
     * Constructor to create a new memPool, 
     * 
     *********************************************************************************************/

    constructor() {

        this.mempool = [];
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

    addToMemPool(validationRequestObject) {

        
        let self = this;
        validationRequestObject.timeout = setTimeout(function () { self.removeValidationRequest(validationRequestObject.walletAddress) }, TimeoutRequestsWindowTime);
        console.log("in addToMemPool and validationRequestObject is: " + validationRequestObject);
        this.mempool.push(validationRequestObject);
    }

    removeValidationRequest(walletAddress) {
        console.log("in removeValidationRequest walletAddress is: " + walletAddress);
        this.mempool.splice(this.findObjectByKey(this.mempool, walletAddress, walletAddress), 1);
        console.log(" in removeValidationRequest just removed an object that timed out mempool is: " + this.mempool);
        //this.mempool.splice(this.mempool.walletAddress.indexOf(walletAddress), 1);

    }

    findObjectByKey(array, key, value) {
        console.log("in findObjectByKey value is: " + value);
        for (var i = 0; i < array.length; i++) {
            console.log("in findObjectByKey for loop and i is: " + i);
            if (array[i][key] === value) {
                console.log("in findObjectByKey returning array position i: " + i);
                return i;
            }
        }
        return null;
    }

}

module.exports.memPool = memPool;
