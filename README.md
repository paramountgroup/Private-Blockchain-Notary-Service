# RESTful-API-wth-Node.js

Udacity Blockchain developer project RESTful Web API with Node.js Framework by Bob Ingram
 
 * This program creates a web API using Node.js framework that interacts with my private blockchain
 * Submits and retrieves data using an application like postman or url on localhost port 8000 http://localhost:8000/api/block/
 * The boilerplate code for this project was taken from the Udacity Web Services with Node.js lesson 2 
  practice express.js exercise and incorporates private blockchain from project 2.

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
