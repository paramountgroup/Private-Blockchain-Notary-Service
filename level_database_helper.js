// JavaScript source code level_database_helper.js

const level = require('level');
const hex2ascii = require('hex2ascii');

const chaindb = './chaindata';

/***********************************************************************************************
 * create LevelDatabase class for storing and retrieving blockchain data in LevelDB
 * *********************************************************************************************/

class LevelDatabase {
    // create the LevelDB persistent database for storing blockchain
    constructor() {
        this.db = level(chaindb);
    }

    /*============================================================================================
    * getLevelDBData returns the requested block object using blockheight as the key for lookup
    =============================================================================================*/

    getLevelDBData(key) {
        return new Promise((resolve, reject) => {
            this.db.get(key, function (err, value) {
                if (err) {
                    console.log("Not found!", err);
                    reject(err);
                } else {
                    resolve(JSON.parse(value));
                }
            });
        });
    }


    /*============================================================================================
    * getLevelDBDataByHash returns the requested block object using hash as the key for lookup
    =============================================================================================*/
    
    getLevelDBDataByHash(hashValue) {
        let self = this.db;
        let block = null;
        console.log("in getLevelDBDataByHash passed in hash is: " + hashValue);
        console.log("in getLevelDBByHash and this.db is: " + JSON.stringify(this.db));
        return new Promise(function (resolve, reject) {
            self.createReadStream()
                .on('data', function (data) {
                    console.log("in getLevelDBDataByHash reading stream JSON.parse(data.value).hash is: " + JSON.parse(data.value).hash);
                    console.log("in getLevelDBDataByHash reading stream data is: " + data);
                    console.log("in getLevelDBDataByHash reading stream JSON.stringify(data) is: " + JSON.stringify(data));
                    if (JSON.parse(data.value).hash === hashValue) {
                        block = JSON.parse(data.value);
                        
                    }
                })
                .on('error', function (err) {
                    reject(err)
                })
                .on('close', function () {
                    resolve(block);
                });
        });
    }

    /*============================================================================================
   * getLevelDBDataByHash returns the requested block object using hash as the key for lookup
   =============================================================================================*/

    getLevelDBDataByAddress(addressValue) {
        let self = this.db;
        let block = null;
        let blockArray = [];
        console.log("in getLevelDBDataByAddress and this.db is: " + JSON.stringify(this.db));
        return new Promise(function (resolve, reject) {
            self.createReadStream()
                .on('data', function (data) {
                    console.log("in getLevelDBDataByAddress reading stream JSON.parse(data.value) is: " + JSON.parse(data.value));
                    console.log("in getLevelDBDataByAddress reading stream data is: " + data);
                   
                    if (JSON.parse(data.value).body.address === addressValue) {
                        console.log("in getLevelDBDataByAddress reading stream JSON.parse(data.value).body.address is: " + JSON.parse(data.value).body.address);
                        console.log("in getLevelDBDataByAddress passed in addressValue  is: " + addressValue);
                        block = JSON.parse(data.value);
                        block.body.star.story = hex2ascii(block.body.star.story);
                        blockArray.push(block);

                    }
                })
                .on('error', function (err) {
                    reject(err)
                })
                .on('close', function () {
                    console.log("in getLevelDBDataByAddress block sent back is: " + JSON.stringify(block));
                    resolve(blockArray);
                });
        });
    }

    /******************************************************************************************
    * addDataToLevelDB will add block object 'value' to this.db blockchain database 
    *******************************************************************************************/

    addDataToLevelDB(block) {
        //Determine blockchain height and add next block
        let i = 0;
        let self = this.db;
        return new Promise(function (resolve, reject) {
            // read blockchain database and count the number of blocks
            self.createReadStream().on('data', function (data) {
                i++;
            }).on('error', function (err) {
                reject(err);
                }).on('close', function () {
                // save key value pair in blockchain database this.db
                self.put(i, JSON.stringify(block), function (err) {
                    if (err) return console.log('Block ' + key + ' submission failed', err);
                });
                resolve(block);
            });
        });
    }
}

module.exports.LevelDatabase = LevelDatabase;
