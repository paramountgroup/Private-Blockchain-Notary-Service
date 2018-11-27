// JavaScript source code block_controller.js used to create BlockController class

const BlockClass = require('./block.js');
const BlockChain = require('./blockchain.js');
const MemPool = require('./mempool.js');

const bitcoin = require('bitcoinjs-lib');
const bitcoinMessage = require('bitcoinjs-message');

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
        this.getBlockByIndex();
        this.postNewBlock();
        this.requestValidation();
        this.requestToValidate();
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



    requestToValidate() {
        console.log("in requestToValidate ");
        this.app.post("/message-signature/validate", (req, res) => {
           // console.log("in requestToValidate ");
            
            console.log("in requestToValidate req.body is: " + JSON.stringify(req.body));
            if (req.body.address && req.body.signature) {
                let validationResultArray = this.memPool.validateRequestByWallet(req.body)
              
                return res.status(validationResultArray[0]).json(validationResultArray[1]);
            } else {
                return res.status(404).send("Missing address or signature to validate");
            }
        })
    }

    /*************************************************************************************
     * Implement a GET Endpoint to retrieve a block by index, url: "/api/block/:index"
     *************************************************************************************/

    getBlockByIndex() {
        this.app.get("/block/:height?", (req, res) => {
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
    * Implement a POST Endpoint to add a new Block, url: "/api/block"
    ***********************************************************************/


    postNewBlock() {
        this.app.post("/block/:data?", (req, res) => {
            // retrieve data and create new block
            if (req.params.data) {
                let newBlock = new BlockClass.Block(req.params.data);
                // add block and check for errors
                this.blockChain.addBlock(newBlock).then((addedBlock) => {
                    if (addedBlock) {// success return block that was added
                        return res.status(201).json(addedBlock);
                    } else {
                        return res.status(500).send("Something went wrong block was NOT added");
                    }
                }).catch((error) => {//catch error if something went wrong with promises
                    return res.status(500).send("Something went wrong! " + error);
                })
            } else {// data param was empty
                res.status(403).send("Forbidden to persist block without content");
            }
        });
    }
}

console.log("bitcoinmessage.verify is: " + bitcoinMessage.verify(message, address, signature));

/**************************************************************
 * Exporting the BlockController class
 * @param {*} app 
 **************************************************************/

module.exports = (app) => { return new BlockController(app); }