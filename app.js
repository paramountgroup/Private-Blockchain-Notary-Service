// JavaScript source code blockchain.js used to create Blockchain class

/*********************************************************************************************************
 * Udacity Blockchain developer project - Build a Private BlockChain Notary Service - by Bob Ingram
 * 
 * This project builds a Star Registry Service that allows users to claim ownership 
 * of their favorite star in the night sky.
 * 
 * This program creates a web API using Node.js framework that interacts with my private blockchain
 * and submits and retrieves data using an application like postman or url on localhost port 8000
 * 
 * The boilerplate code for some of this project was taken from the Udacity Web Services with Node.js lesson 2 
 * practise express.js exercise and the project instruction notes
 * 
 *    The Notary Service creates a Blockchain dataset that allow you to store a Star 
 *
 *       The application persists the data (using LevelDB).
 *       The application allows users to identify the Star data with the owner.
 *       
 *     The Mempool component
 *
 *       The mempool component stores temporal validation requests for 5 minutes (300 seconds).
 *       The mempool component stores temporal valid requests for 30 minutes (1800 seconds).
 *       The mempool component manages the validation time window.
 *       
 *     The REST API that allows users to interact with the application.
 *
 *       The API allow users to submit a validation request.
 *       The API allow users to validate the request.
 *       The API encodes and decodes the star data.
 *       The API allows users to submit the Star data.
 *       The API allows lookup of Stars by hash, wallet address, and height.
 * 
 ********************************************************************************************************/

//Importing Express.js module
const Express = require("express");
//Importing BodyParser.js module
const BodyParser = require("body-parser");

/*****************************************************
 * Class Definition for the REST API
 ******************************************************/

class BlockAPI {

    /************************************************
     * Constructor that allows initialize the class 
     ************************************************/
    constructor() {
        this.app = Express();
        this.initExpress();
        this.initExpressMiddleWare();
        this.initControllers();
        this.start();
    }

    /************************************************
     * Initilization of the Express framework
     ************************************************/
    initExpress() {
        this.app.set("port", 8000);
    }

    /*************************************************
     * Initialization of the middleware modules
     *************************************************/
    initExpressMiddleWare() {
        this.app.use(BodyParser.urlencoded({ extended: true }));
        this.app.use(BodyParser.json());
    }

    /**************************************************
     * Initilization of all the controllers
     **************************************************/
    initControllers() {
        require("./block_controller.js")(this.app);
    }

    /**************************************************
     * Starting the REST Api application
     ***************************************************/
    start() {
        let self = this;
        this.app.listen(this.app.get("port"), () => {
            console.log(`Server Listening for port: ${self.app.get("port")}`);
        });
    }

}

new BlockAPI();