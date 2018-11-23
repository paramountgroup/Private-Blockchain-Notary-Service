// JavaScript source code blockchain.js used to create Blockchain class

const SHA256 = require('crypto-js/sha256');
const leveldatabase = require('./level_database_helper.js');
const block = require('./block.js');

/**********************************************************************************
 *    Create Blockchain class for retrieving and adding blocks to the blockchain
 * *********************************************************************************/

class Blockchain {
    constructor() {
        //verify Genesis block and create if necessary
        this.db = new leveldatabase.LevelDatabase();
        this.verifyGenesisBlock();
    }

    async verifyGenesisBlock() {
        // get current height of blockchain
        const height = await this.getBlockHeight();
        // if a block of -1 is returned there is not a genesis block therefore create one      
        if (height === (-1)) {
            // create genesis block
            let genesisBlock = new block.Block("First Block - Genesis Block");
            // UTC timestamp
            genesisBlock.time = new Date().getTime().toString().slice(0, -3);
            // create a Hash
            genesisBlock.hash = SHA256(JSON.stringify(genesisBlock)).toString();
            // add genesis block to blockchain and await promise
            await this.db.addDataToLevelDB(genesisBlock);
        }
    }

    /********************************************************************************
     * @param {any} newBlock
     *   Add new block to blockchain
    *********************************************************************************/
   
    async addBlock(newBlock) {
        // get blockchain height
        let prevBlockHeight = await this.getBlockHeight();
        // assign height to the next block
        newBlock.height = prevBlockHeight + 1;
        // UTC timestamp
        newBlock.time = new Date().getTime().toString().slice(0, -3);
        // previous block hash genesis block does not have a previous hash
        if (newBlock.height > 0) {
            let prevBlock = await this.getBlock(prevBlockHeight);
            //assign previousBlockHash
            newBlock.previousBlockHash = prevBlock.hash;
            // create hash for newBlock
            newBlock.hash = SHA256(JSON.stringify(newBlock)).toString();
            // add the new block and use await to get promise resolve
            let addedBlock = await this.db.addDataToLevelDB(newBlock);
            return (addedBlock);
        }
    }

    /**********************************************************************
    *  Find the height of the last block and resolve promise
    ************************************************************************/

    getBlockHeight() {
        return new Promise((resolve, reject) => {
            let i = -1;
            // Read the entire blockchain and count the blocks
            this.db.db.createReadStream()
                .on('data', data => {
                    i++;
                })
                .on('error', err => reject(err))
                .on('close', () => {
                    resolve(i);
                });
        });
    }

    /************************************************************************************************
     * @param {any} blockHeight
     * Return a requested block from the blockchain using blockHeight as the key in the database
     * **********************************************************************************************/

    async getBlock(blockHeight) {
        try {
            // wait for requested block to resolve promise and then return requested block
            return await this.db.getLevelDBData(blockHeight);
        } catch (err) {
            console.log(err);
        }
    }

    /*****************************************************************************************
     * @param {any} key
     *  validate block - checks and individual block for correct hash
     *****************************************************************************************/

    async validateBlock(key) {
        // get block object
        let block = await this.getBlock(key);
        // get block hash
        let blockHash = block.hash;
        // remove block hash to test block integrity
        block.hash = '';
        // generate block hash
        let validBlockHash = SHA256(JSON.stringify(block)).toString();
        // Compare
        if (blockHash === validBlockHash) {
            // block validated return true
            return true;
        } else {
            // block not valid return false
            return false;
        }
    }

    /***************************************************************************************************** 
    *    Validate blockchain
    ******************************************************************************************************/

    async validateChain() {
        // save errors in array
        let errorLog = [];
        let lastBlockHeight = await this.getBlockHeight();
        let i = 0;
        do {
            // validate block
            let validBlock = await this.validateBlock(i);
            if (!validBlock) errorLog.push(i);
            // Retrieve current block and nextBlock then compare hash and previousHash to validate chain
            let block = await this.getBlock(i);
            let blockHash = block.hash;
            let nextBlock = await this.getBlock(i + 1);
            let previousHash = nextBlock.previousBlockHash;
            i++;
            // verify current blockHash in the current block is same as previousHash in nextBlock
            if (blockHash !== previousHash) {
                errorLog.push(i);
            }
        } while (i < lastBlockHeight);
        //validate last block does not have next block to validate previous hash
        let validBlock = await this.validateBlock(i);
        if (!validBlock) errorLog.push(i);
        // if errors detected send to console
        if (errorLog.length > 0) {
            // blockchain did not validate return false
            return false;
        } else {
            console.log('No errors detected');
            // valid blockchain return true
            return true;
        }
    }
}

module.exports.Blockchain = Blockchain;
