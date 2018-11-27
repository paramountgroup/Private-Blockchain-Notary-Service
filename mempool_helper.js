// JavaScript source code mempool_helper.js


module.exports = {

    findObjectByKey(array, key, value) {
        console.log("in findObjectByKey array is: " + array);
        console.log("in findObjectByKey value is: " + value);
        for (var i = 0; i < array.length; i++) {
            console.log("in findObjectByKey for loop and i is: " + i);
            console.log("in findObjectByKey key is: " + key + " value is: " + value);
            console.log("in findObjectByKey array[i].walletAddress is: " + array[i].walletAddress);
            console.log("in findObjectByKey array[i].key is: " + array[i].key + " i is: " + i);
            if (array[i][key] === value) {
                console.log("in findObjectByKey returning array position i: " + i);
                console.log(" in findObjectByKey array[i].key is: " + array[i].key);
                console.log(" in findObjectByKey value is: " + value);
                return i;
            }
        }
        //did not find the requested address the mempool - return null
        return null;
    },

    findTimeLeftInMempool(mempoolRequestedObject, TimeoutRequestsWindowTime) {
      //  console.log("in addARequestValidation for loop checking if request exists i is: " + i);
        let timeElapse = (new Date().getTime().toString().slice(0, -3)) - mempoolRequestedObject.requestTimeStamp;
        console.log("in addARequestValidation timeElase is: " + timeElapse);
        let timeLeft = (TimeoutRequestsWindowTime / 1000) - timeElapse;
        console.log("in addARequestValidation timeLeft is: " + timeLeft);
        return timeLeft;
    }
}