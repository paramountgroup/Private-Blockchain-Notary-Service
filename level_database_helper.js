// JavaScript source code level_database_helper.js

const Level = require('level');
const Hex2Ascii = require('hex2ascii');
const ChainDB = './chaindata';

/***********************************************************************************************
 * create LevelDatabase class for storing and retrieving blockchain data in LevelDB
 * *********************************************************************************************/

class LevelDatabase {
    // create the LevelDB persistent database for storing blockchain
    constructor() {
        this.db = Level(ChainDB);
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
    * getLevelDBDataByHash returns the requested block object using hash as the value for lookup
    * hash values are unique therefore only one block returned
    =============================================================================================*/

    getLevelDBDataByHash(hashValue) {
        let self = this.db;
        let block = null;
        // set promise while searching level database for the given hash value
        return new Promise(function (resolve, reject) {
            self.createReadStream()
                .on('data', function (data) {
                    /* the blockchain is stored as key value pairs. In this case the key (block height) is not helpful so we search 
                    *  all the values (aka blocks) to find the one with the give hash*/
                    if (JSON.parse(data.value).hash === hashValue) {
                        //found the block and parsed back into a block object
                        block = JSON.parse(data.value);
                        //decoded star story back to ASCII prior to return to the user
                        block.body.star.storyDecoded = Hex2Ascii(block.body.star.story)                     
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

    /*==========================================================================================================
    * getLevelDBDataByAddress returns the requested block object using wallet address as the value for lookup
    * It is possible to have multiple stars registered to one wallet address. Star blocks are returned in an array
    ===========================================================================================================*/

    getLevelDBDataByAddress(addressValue) {
        let self = this.db;
        let block = null;
        let blockArray = [];
        // set new promise to return requested blocks when completed searching the database
        return new Promise(function (resolve, reject) {
            self.createReadStream()
                .on('data', function (data) {
                    /* the blockchain is stored as key value pairs. In this case the key (block height) is not helpful so we search 
                   *  all the values (aka blocks) to find the one with the give wallet address*/
                    if (JSON.parse(data.value).body.address === addressValue) {
                        // a star block was found matching the requested wallet address
                        block = JSON.parse(data.value);
                        //convert the star story back into ascii before adding block to the array
                        block.body.star.storyDecoded = Hex2Ascii(block.body.star.story);
                        blockArray.push(block);
                    }
                })
                .on('error', function (err) {
                    reject(err)
                })
                .on('close', function () {
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
