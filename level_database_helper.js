// JavaScript source code level_database_helper.js

const level = require('level');
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
