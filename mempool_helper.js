// JavaScript source code mempool_helper.js


module.exports = {

    /*****************************************************************************************
    *  findObjectByKey is will find an object by key in an array and return the array position		   
    ******************************************************************************************/

    findObjectByKey(array, key, value) {
        //cycle through the array and find index position that matches the given passed value
        console.log("in findObjectByKey and array is: " + array);
       // console.log("in findObjectByKey JSON.stringify(array.status) is: " + JSON.stringify(array.status));
        console.log("in findObjectByKey and key is: " + key);
      
        console.log("in findObjectByKey and value is: " + value);
       // console.log("in findObjectByKey and array[0].walletAddress is: " + array[0].walletAddress);
        for (var i = 0; i < array.length; i++) {
            console.log("in findObjectByKey and array[i].status[key] is: " + array[i].status[key]);           
                if (array[i].status[key] === value) {
                    return i;
                }
        }
        console.log("in findObjectByKey returning null");
        //did not find the requested value the mempool - return null
        return null;
    },

    /*****************************************************************************************
    *  findTimeLeftInMempool checks how long an object has been in the mempool array and returns 
    *  time left - In this case it is 5 minute countdown
    ******************************************************************************************/

    findTimeLeftInMempool(mempoolRequestedObject, TimeoutRequestsWindowTime) {
        let timeElapse = (new Date().getTime().toString().slice(0, -3)) - mempoolRequestedObject.status.requestTimeStamp;
        // subtract time elapsed from 5 minutes and return time left
        let timeLeft = (TimeoutRequestsWindowTime / 1000) - timeElapse;
        return timeLeft;
    }
}