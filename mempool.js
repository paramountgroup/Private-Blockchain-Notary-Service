// JavaScript source code mempool.js

const RequestObjectClass = require('./request_object.js');

class memPool {

    /*********************************************************************************************
     * Constructor to create a new memPool, 
     * 
     *********************************************************************************************/

    constructor() {

        this.mempool = [];
        this.timeoutRequests = [];

    }

    addARequestValidation(validationRequest) {

        console.log(" in addARequestValidation validationRequest.address is: " + validationRequest.address);
        const TimeoutRequestsWindowTime = 5 * 60 * 1000;//aka 5 minutes or 50000 miliseconds
        console.log(" in addARequestValidation this.mempool.length before for loop is: " + this.mempool.length);
        for (var i = 0; i <= this.mempool.length - 1; i++) {
            console.log(" in addARequestValidation in for loop this.mempool.length is: " + this.mempool.length + " i is: " + i);
            // check if request exists in mempool < 5 minutes old
            console.log(" in addARequestValidation in for loop this.mempool[i].address is: " + this.mempool[i].address);
            console.log(" in addARequestValidation in for loop validationRequest.address is: " + validationRequest.address);
            if (this.mempool[i].walletAddress === validationRequest.address) {
                console.log("in addToMemPool for loop checking if request exists i is: " + i);
                let timeElapse = (new Date().getTime().toString().slice(0, -3)) - this.mempool[i].requestTimeStamp;
                console.log("in addToMemPool timeElase is: " + timeElapse);
                let timeLeft = (TimeoutRequestsWindowTime / 1000) - timeElapse;
                console.log("in addToMemPool timeLeft is: " + timeLeft);
                
                this.mempool[i].validationWindow = timeLeft;
                console.log(" in addToMemPool mempool[i].validationWindow is: " + this.mempool[i].validationWindow);
          
                return this.mempool[i];
            } 
           
        }
        // Request not found in the mempool create a new validationRequestObject & return object
        let validationRequestObject = new RequestObjectClass.requestObject(validationRequest.address);
        this.addToMemPool(validationRequestObject);
        return validationRequestObject;

        /*
        console.log("in addARequestValidation and validationRequest.address is: " + validationRequest.address);
        let validationRequestObject = new RequestObjectClass.requestObject(validationRequest.address);
        console.log("in addARequestValidation validationRequestObject is: " + JSON.stringify(validationRequestObject));
        let timeElapse = (new Date().getTime().toString().slice(0, -3)) - validationRequestObject.requestTimeStamp;
        console.log("inAddARequestValidation and time Elapse is: " + timeElapse);
        let timeLeft = (TimeoutRequestsWindowTime / 1000) - timeElapse;
        console.log("inAddARequestValidation and time Elapse is: " + timeElapse);
        //req.validationWindow = timeLeft;
        //remove validation request after 5 minutes
        return validationRequestObject;
        */

    }

    addToMemPool(validationRequestObject) {
        console.log("in addToMemPool and validationRequestObject is: " + JSON.stringify(validationRequestObject));
        this.mempool.push(validationRequestObject);

    }
}

module.exports.memPool = memPool;
