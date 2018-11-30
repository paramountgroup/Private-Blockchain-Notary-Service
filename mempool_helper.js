// JavaScript source code mempool_helper.js


module.exports = {

   /*******************************************************************************************************
   *   addToMemPool() receives a validationRequestObject and stores it in the mempool or mempoolValid
   *   array. These objects have a timeout that will remove them in 5 minutes for mempool and 30 min for mempoolValid 
  **********************************************************************************************************/

    addToMemPool(array, validationRequestObject, timer) {
        //this validationRequestObject will self destruct after 5 minutes. The timeout function removes it from the mempool array after 5 min
        validationRequestObject.timeout = setTimeout(function () { module.exports.removeValidationRequest(array, "walletAddress", validationRequestObject.status.walletAddress) }, timer);
        // add object with timeout to mempool array
        array.push(validationRequestObject);
    },

     /*****************************************************************************************************
    *  removeValidationRequest is will find an object by key in an array and remove it from the array		   
    *******************************************************************************************************/

    removeValidationRequest(array, key, value) {
        //find the array position of the object to be removed and use slice to remove
        array.splice(module.exports.findObjectByKey(array, key, value), 1);
    },

    /******************************************************************************************************
    *  findObjectByKey is will find an object by key in an array and return the array index position		   
    *******************************************************************************************************/

    findObjectByKey(array, key, value) {
        //cycle through the array and find index position that matches the given passed value
        for (var i = 0; i < array.length; i++) {
                if (array[i].status[key] === value) {
                    return i;
                }
        }
        //did not find the requested value the mempool - return null
        return null;
    },

    /*****************************************************************************************************
    *  findTimeLeftInMempool checks how long an object has been in the mempool array and returns 
    *  time left - In this case it is 5 minute countdown
    ******************************************************************************************************/

    findTimeLeftInMempool(mempoolRequestedObject, TimeoutRequestsWindowTime) {
        let timeElapse = (new Date().getTime().toString().slice(0, -3)) - mempoolRequestedObject.status.requestTimeStamp;
        // subtract time elapsed from 5 minutes and return time left
        let timeLeft = (TimeoutRequestsWindowTime / 1000) - timeElapse;
        return timeLeft;
    }
}