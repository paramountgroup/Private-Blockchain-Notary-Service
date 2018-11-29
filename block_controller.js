// JavaScript source code block_controller.js used to create BlockController class

const BlockClass = require('./block.js');
const StarBlockClass = require('./star_block.js');
const BlockChain = require('./blockchain.js');
const MemPool = require('./mempool.js');
const hex2ascii = require('hex2ascii');
const bitcoin = require('bitcoinjs-lib');
const bitcoinMessage = require('bitcoinjs-message');
const WordCount = require('wordcount');
const ByteCount = require('bytes-counter');

let address = '142BDCeSGbXjWKaAnYXbMpZ6sbrSAo3DpZ'
let signature = 'IJtpSFiOJrw/xYeucFxsHvIRFJ85YSGP8S1AEZxM4/obS3xr9iz7H0ffD7aM2vugrRaCi/zxaPtkflNzt5ykbc0='
let message = '142BDCeSGbXjWKaAnYXbMpZ6sbrSAo3DpZ:1532330740:starRegistry'



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
     * Implement a GET Endpoint to retrieve a block by index, url: "/api/block/:index"
     *************************************************************************************/

    requestValidation() {
        console.log("in requestValidation ");
        this.app.post("/requestValidation", (req, res) => {
            console.log("in requestValidation ");
            // Listen for height param and convert to integer if necessary
            console.log("in requestValidation req.body is: " + JSON.stringify(req.body));
            if (req.body.address) {
                let returnValidationObject = this.memPool.addARequestValidation(req.body)
                delete returnValidationObject.timeout;
                return res.status(200).json(returnValidationObject);
            } else {
                return res.status(404).send("no address to validate");
            }
        })
    }

    /*********************************************************************************************************
     * Implement a POST Endpoint to validate signature url:http://localhost:8000/message-signature/validate
     * Web API post endpoint validates message signature with JSON response.
     * POST request body contains user wallet address and valid signature from electrum wallet in JSON format.
     *********************************************************************************************************/


    validateSignature() {
        console.log("in requestToValidate ");
        this.app.post("/message-signature/validate", (req, res) => {
            // console.log("in requestToValidate ");

            console.log("in requestToValidate req.body is: " + JSON.stringify(req.body));
            if (req.body.address && req.body.signature) {
                let validRequestArray = this.memPool.validateRequestByWallet(req.body)

                return res.status(validRequestArray[0]).json(validRequestArray[1]);
            } else {
                return res.status(404).send("Missing address or signature to validate");
            }
        })
    }

    /*************************************************************************************
     * Implement a GET Endpoint to retrieve a block by index, url: "/block/:height"
     *************************************************************************************/

    getStarBlockByHeight() {
        this.app.get("/block/:height", (req, res) => {
            let genesisText = new Buffer("This is the genesis block it does not have a star").toString('hex');
            console.log("in getStarBlockByHeight and hex text is: " + genesisText);
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
                            block.body.star.story = hex2ascii(block.body.star.story);
                            return res.status(200).json(block);
                        } else {
                            return res.status(500).send("Block Not Found Unknown Reason");
                        }
                    })
                } //catch error if something went wrong with promises
            }).catch((error) => { return res.status(500).send("Something went wrong! " + error); })
        })
    }

    /**********************************************************************
    * Implement a POST Endpoint to add a new Block, url: "/block"
    ***********************************************************************/


    postNewStar() {
        this.app.post("/block", (req, res) => {
            // retrieve data and create new block


            if (req.body) {
                let asciitext = /^[\x00-\x7F]*$/.test(req.body.star.story)
                console.log("in postNewStar checking ascii text: " + asciitext);
                if (/^[\x00-\x7F]*$/.test(req.body.star.story) != true) {
                    return res.status(400).send("Star story must be ascii test");
                } else if (WordCount(req.body.star.story) > 250) {
                    return res.status(400).send("Star story can not exceed 250 words");
                } else if (ByteCount.count(req.body.star.story) > 500) {
                    return res.status(400).send("Star story can not exceed 500 bytes");
                };
                console.log("in postNewStar starting verifyAddressRequest");
                let validAddressRequestArray = this.memPool.verifyAddressRequest(req.body)
                if (validAddressRequestArray[2]) {
                    console.log("in postNewStar and req.body.star.story is: " + req.body.star.story);
                    let starStoryHexEncode = new Buffer(req.body.star.story).toString('hex');
                    let star = new StarBlockClass.StarBlock(req.body.address, req.body.star.ra, req.body.star.dec, req.body.star.mag, req.body.star.cen, starStoryHexEncode);
                    let newBlock = new BlockClass.Block(star);
                    // add block and check for errors
                    this.blockChain.addBlock(newBlock).then((addedBlock) => {
                        if (addedBlock) {// success return block that was added
                            addedBlock.body.star.story = hex2ascii(addedBlock.body.star.story);
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
            console.log(" in getStarBlockByHash req.params.hash is: " + req.params.hash);
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