# Privat Blockchain Notary Service with Node.js

Udacity Blockchain developer project Private Blockchain Notary Service API with Node.js Framework by Bob Ingram
 
 This project builds a Star Registry Service that allows users to claim ownership 
 of their favorite star in the night sky.
  
  This program creates a web API using Node.js framework that interacts with my private blockchain
  and submits and retrieves data using an application like postman or url on localhost port 8000
  
 The boilerplate code for some of this project was taken from the Udacity Web Services with Node.js lesson 2 
  practise express.js exercise and the project instruction notes
  
     The Notary Service creates a Blockchain dataset that allow you to store a Star 
 
       * The application persists the data (using LevelDB).
       * The application allows users to identify the Star data with the owner.
       
      The Mempool component
 
       * The mempool component stores temporal validation requests for 5 minutes (300 seconds).
       * The mempool component stores temporal valid requests for 30 minutes (1800 seconds).
       * The mempool component manages the validation time window.
        
      The REST API that allows users to interact with the application.
 
       * The API allow users to submit a validation request.
       * The API allow users to validate the request.
       * The API encodes and decodes the star data.
       * The API allows users to submit the Star data.
       * The API allows lookup of Stars by hash, wallet address, and height.
 
 

## Getting Started - Steps to Follow

1. Clone the repository to your local computer.
2. Open the terminal in the directory you downloaded the repository and install npm: `npm install`.
3. Install express.js: npm install express --save
4. Run your application `node app.js`
5. Test your Endpoints with Curl or Postman.  http://localhost:8000/api/block/



## Prerequisites  - Node.js
This API requires node.js, node package manager (npm) & express.js

### To install install node.js on your windows machine:

* Download the Windows installer from the Nodes.js® web site.
* Run the installer 
* Follow the prompts in the installer 
* Restart your computer


The API Creates Two Endpoints per the project rubric

**GET Block Endpoint**
GET request using URL path with a block height parameter. The response for the endpoint provides a block object is JSON format.

	URL
	http://localhost:8000/block/[blockheight]

	Example URL path:
	http://localhost:8000/block/0, where '0' is the block height.

	Response
	The response for the endpoint provides a block object is JSON format.

	Example GET Response
	For URL, http://localhost:8000/block/0

	`{
					"hash": "7749df61bffc6ca0c7f169fccbb52794ac66d485aa6114792d4b70413ce259a2",
					"height": 0,
					"body": "First Block - Genesis Block",
					"time": "1542737644",
					"previousBlockHash": ""
	}`

**POST Block Endpoint**
Post a new block with data payload option to add data to the block body. The block body supports a string of text. The response for the endpoint provides the block object added the blockchain in JSON format.

	Response
	The response for the endpoint provides a block object in JSON format.

	Example POST response
	For URL: http://localhost:8000/block/block

	{
	    "hash": "157c14376cacca729dc82edc74ac87dffda527b1d026b3930396df1935c000f6",
	    "height": 1,
	    "body": "block",
	    "time": "1542737794",
	    "previousBlockHash": "7749df61bffc6ca0c7f169fccbb52794ac66d485aa6114792d4b70413ce259a2"
	}


End with an example of getting some data out of the system or using it for a little demo

Running the tests
Explain how to run the automated tests for this system

Break down into end to end tests
Explain what these tests test and why

Give an example
And coding style tests
Explain what these tests test and why

Give an example
Deployment
Add additional notes about how to deploy this on a live system

## Built With
Express.js - Express is a minimal and flexible Node.js web application framework.

## Versioning
Visual Studio linked to github for version control

## Author
Bob Ingram - Boilerplate code provided by Udacity Blockchain developer course

## License
This project is licensed under the MIT License - see the LICENSE.md file for details

## Acknowledgments
Thanks to **Programming with Mosh** for the excellent expressjs tutorial on youtube.
https://www.youtube.com/watch?v=pKd0Rpw7O48&t=1954s
