// JavaScript source code blockchain.js used to create Blockchain class

/*********************************************************************************************************
 *Udacity Blockchain developer project RESTful Web API with Node.js Framework by Bob Ingram
 * 
 * This program creates a web API using Node.js framework that interacts with my private blockchain
 * and submits and retrieves data using an application like postman or url on localhost port 8000
 * 
 * The boilerplate code for this project was taken from the Udacity Web Services with Node.js lesson 2 
 * practise express.js exercise
 ********************************************************************************************************/

//Importing Express.js module
const express = require("express");
//Importing BodyParser.js module
const bodyParser = require("body-parser");

/*****************************************************
 * Class Definition for the REST API
 ******************************************************/

class BlockAPI {

    /************************************************
     * Constructor that allows initialize the class 
     ************************************************/
    constructor() {
        this.app = express();
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
        this.app.use(bodyParser.urlencoded({ extended: true }));
        this.app.use(bodyParser.json());
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