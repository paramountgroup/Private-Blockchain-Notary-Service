// JavaScript source code block_controller.js used to create BlockController class

const BlockClass = require('./block.js');
const StarBlockClass = require('./star_block.js');
const BlockChain = require('./blockchain.js');
const MemPool = require('./mempool.js');
const Hex2Ascii = require('hex2ascii');
const ByteCount = require('bytes-counter');


/********************************************************************
 * Controller Definition to encapsulate routes to work with blocks
 ********************************************************************/

class BlockController {

    /*********************************************************************************************
     * Constructor to create a new BlockController, you need to initialize here all your endpoints
     * @param {*} app 
     *********************************************************************************************/

    constructor(app) {
        this.app = app;
        this.blockChain = new BlockChain.Blockchain();
        this.memPool = new MemPool.memPool();
        this.getStarBlockByHeight();
        this.postNewStar();
        this.requestValidation();
        this.validateSignature();
        this.postNewStar();
        this.getStarBlockByHash();
        this.getStarBlockByAddress()
    }

    /*************************************************************************************
     * Web API post endpoint validates request with JSON response. The validation response
     * contains the message details, timestamp and time remaining for validation window
     * Validation windwo is set to 5 minutes. When resubmitting request the validation
     * window will reduce until it expires
     *************************************************************************************/

    requestValidation() {
        this.app.post("/requestValidation", (req, res) => {
            // Listen for request Validation with wallet address as part of the request body          
            if (req.body.address) {
                let returnValidationObject = this.memPool.addARequestValidation(req.body)
                // remove the timeout function from the mempool return object 
                delete returnValidationObject.timeout;
                // send ok status and proper validation object
                return res.status(200).json(returnValidationObject);
            } else {
                return res.status(400).send("No address to validate");
            }
        })
    }

    /*********************************************************************************************************
     * Implement a POST Endpoint to validate signature url:http://localhost:8000/message-signature/validate
     * Web API post endpoint validates message signature with JSON response.
     * POST request body contains user wallet address and valid signature from electrum wallet in JSON format.
     *********************************************************************************************************/


    validateSignature() {
        this.app.post("/message-signature/validate", (req, res) => {
            // check if required wallet address and signature included in the request validate signature
            if (req.body.address && req.body.signature) {
                // returned array validRequestArray contain both valid or invalid response
                let validRequestArray = this.memPool.validateRequestByWallet(req.body)
                return res.status(validRequestArray[0]).json(validRequestArray[1]);
            } else {
                return res.status(404).send("Missing address or signature to validate");
            }
        })
    }

    /*************************************************************************************
     *  GET Endpoint to retrieve a block by index (block height), url: "/block/:height"
     *************************************************************************************/

    getStarBlockByHeight() {
        this.app.get("/block/:height", (req, res) => {
            let genesisText = new Buffer("This is the genesis block it does not have a star").toString('hex');
            // Listen for height param and convert to integer if necessary
            let height = parseInt(req.params.height, 10);
            // start error checking if ok send back requested block in json format
            this.blockChain.getBlockHeight().then((blockHeight) => {
                // check if height is not a number
                let notNumber = isNaN(height);
                if ((height > blockHeight) || (height < 0) || notNumber) {
                    //requested height is outside the blockchain height or NaN send 404 error
                    res.status(404).send("Block height parameter is out of bounds or NaN");
                } else {
                    // return requested block
                    this.blockChain.getBlock(height).then((block) => {
                        if (block) { //  requested block retrieved send back in json with 200 status
                            //decode star story back to ASCII before returning response
                            block.body.star.storyDecoded = Hex2Ascii(block.body.star.story);
                            return res.status(200).json(block);
                        } else {
                            return res.status(500).send("Block Not Found Unknown Reason");
                        }
                    })
                } //catch error if something went wrong with promises
            }).catch((error) => { return res.status(500).send("Something went wrong! " + error); })
        })
    }

    /**************************************************************************************************
    * Web API Post Endpoint with JSON response. Star Object and properties are stored within the 
    * body of the block. Star properties include the coordinates with hex encoded story. Star story
    * supports ASCII text, limited to 250 words, 500 bytes and is hex encoded
    ***************************************************************************************************/


    postNewStar() {
        this.app.post("/block", (req, res) => {
            // retrieve POST endpoint data and create new block
            if (req.body) {
                // check star story to ensure submitted as ascii text
                if (/^[\x00-\x7F]*$/.test(req.body.star.story) != true) {
                    return res.status(400).send("Star story must be ascii text");
                // max number of bytes for star is story is 500 bytes
                } else if (ByteCount.count(req.body.star.story) > 500) {
                    return res.status(400).send("Star story can not exceed 250 words:500 bytes");
                };
                // verify there is valid request with confirmed signature
                let validAddressRequestArray = this.memPool.verifyAddressRequest(req.body)
                // verifyAddressRequest verified there was a valid request in mempoolValid[] and the star data is present
                if (validAddressRequestArray[2]) {
                    //encode star story hex prior to adding to the blockchain
                    let starStoryHexEncode = new Buffer(req.body.star.story).toString('hex');
                    let star = new StarBlockClass.StarBlock(req.body.address, req.body.star.ra, req.body.star.dec, req.body.star.mag, req.body.star.cen, starStoryHexEncode);
                    let newBlock = new BlockClass.Block(star);
                    // add block and check for errors
                    this.blockChain.addBlock(newBlock).then((addedBlock) => {
                        if (addedBlock) {// success return block that was added
                            //decode star story to ASCII prior to return to user
                            addedBlock.body.star.storyDecoded = Hex2Ascii(addedBlock.body.star.story);
                            return res.status(201).json(addedBlock);
                        } else {
                            return res.status(500).send("Something went wrong star block was NOT added");
                        }
                    }).catch((error) => {//catch error if something went wrong with promises
                        return res.status(500).send("Something went wrong! " + error);
                    })
                } else {
                    return res.status(validAddressRequestArray[0]).json(validAddressRequestArray[1])
                }
            } else {
                res.status(400).send("No star registration data in request")
            }
        });
    }

    /*************************************************************************************
    * Implement a GET Endpoint to retrieve a block by index, url: "/stars/:hash"
    *************************************************************************************/

    getStarBlockByHash() {
        this.app.get("/stars/hash::hash", (req, res) => {
            // Listen for hash param and convert to integer if necessary
            if (req.params.hash);
            // start error checking if ok send back requested block in json format
            this.blockChain.getBlockByHash(req.params.hash).then((starBlock) => {
                if (starBlock) {
                    //requested starblock returned                     
                    return res.status(200).json(starBlock);
                } else { return res.status(404).send("Star Block not found with hash: " + req.params.hash); }
                //catch error if something went wrong with promises
            }).catch((error) => { return res.status(500).send("Something went wrong! " + error); })
        })
    }

    /*************************************************************************************
    * Implement a GET Endpoint to retrieve a block by index, url: "/stars/address:"
    *************************************************************************************/

    getStarBlockByAddress() {
        this.app.get("/stars/address::address", (req, res) => {
            // Listen for hash param and convert to integer if necessary
            if (req.params.address);
            console.log(" in getStarBlockByHash req.params.hash is: " + req.params.address);
            // start error checking if ok send back requested block in json format
            this.blockChain.getBlockByAddress(req.params.address).then((starBlockArray) => {
                if (starBlockArray) {
                    //requested starblock returned                     
                    return res.status(200).json(starBlockArray);
                } else { return res.status(404).send("Star Block not found with address: " + req.params.address); }
                //catch error if something went wrong with promises
            }).catch((error) => { return res.status(500).send("Something went wrong! " + error); })
        })
    }

}


/**************************************************************
 * Exporting the BlockController class
 * @param {*} app 
 **************************************************************/

module.exports = (app) => { return new BlockController(app); }