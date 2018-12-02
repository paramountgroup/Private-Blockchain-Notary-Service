# Privat Blockchain Notary Service with Node.js

Udacity Blockchain developer project Private Blockchain Notary Service API with Node.js Framework by Bob Ingram
 
 This project builds a Star Registry Service that allows users to claim ownership 
 of their favorite star in the night sky.
  
  This program creates a web API using Node.js and Expressjs framework that interacts with my private blockchain
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
2. Open the terminal in the directory you downloaded the repository and install npm: `npm init`.
3. Install express.js: npm install express --save
4. Run your application `node app.js`
5. Test your Endpoints with Curl or Postman.  http://localhost:8000/block/



## Prerequisites  - Node.js
This API requires node.js, node package manager (npm) & express.js, dependencies are included in the node folder

### To install install node.js on your windows machine:

* Download the Windows installer from the Nodes.js® web site.
* Run the installer 
* Follow the prompts in the installer 
* Restart your computer


**The API Creates six Endpoints**

**POST requestValidation Endpoint**
POST request using URL path http://localhost:8000/requestValidation with data payload option to add 
electrum wallet address in JSON format.


	Example URL path:
	http://localhost:8000/requestValidation body contains JSON object wallet address
	
		{
  	  		"address":"19xaiMqayaNrn3x7AjV5cU4Mk5f5prRVpL"
		}

	Response
	The response for the endpoint provides a request validaton object with included message is JSON format.
		{
    			"walletAddress": "19xaiMqayaNrn3x7AjV5cU4Mk5f5prRVpL",
    			"requestTimeStamp": "1543598821",
    			"message": "19xaiMqayaNrn3x7AjV5cU4Mk5f5prRVpL:1541605128:starRegistry",
   			 "validationWindow": 300
		}

	
**POST Validate Signature Endpoint**
Post a validate signature request with data payload option to obtain permission to add a star to the blockchain. 
The body of the request is a JSON object with wallet address and signature. The response of the request is a JSON
object with registerStar, address, requesttimeStamp, message, validationWindow, message Signature..

	

	Example URL path for post
	URL: http://localhost:8000/message-signature/validate body contains JSON object wallet address & Signature
	
		{
			"address":"19xaiMqayaNrn3x7AjV5cU4Mk5f5prRVpL",
 			"signature":"H8K4+1MvyJo9tcr2YN2KejwvX1oqneyCH+fsUL1z1WBdWmswB9bijeFfOfMqK68kQ5RO6ZxhomoXQG3fkLaBl+Q="
		}
	
	Response
	The response for the endpoint provides a object in JSON format.

		{
    			"registerStar": true,
   			 "status": {
       				"address": "19xaiMqayaNrn3x7AjV5cU4Mk5f5prRVpL",
        			"requestTimeStamp": "1543598824",
        			"message": "19xaiMqayaNrn3x7AjV5cU4Mk5f5prRVpL:1541605128:starRegistry",
        			"validationWindow": 297,
        			"messageSignature": "true"
    			}
		}
		
**POST Star Registration Endpoint**
Post a validate store a star request with data payload option to add a star to the blockchain. 
The body of the request is a JSON object with star properties that include the coordinates and story to encode.
The response of the request is a JSON object with hash, height, address, star coordinates, star story, time, previousBlockHash.

	

	Example URL path for post
	URL: http://localhost:8000/block body contains JSON object wallet address, star coordinates, star story
	
		{
			"address": "19xaiMqayaNrn3x7AjV5cU4Mk5f5prRVpL",
   			 "star": {
            			"dec": "68° 52' 56.9",
            			"ra": "16h 29m 1.0s",
           			 "story": "Found star using https://www.google.com/sky/"
        		}
		}
	
	Response
	The response for the endpoint provides a object in JSON format.

		{
    			"hash": "dcce672971fb325d092a32812842312978c79ca01ec5d83bdb39577abed14b3e",
    			"height": 1,
    			"body": {
        			"address": "19xaiMqayaNrn3x7AjV5cU4Mk5f5prRVpL",
        			"star": {
            "				ra": "16h 29m 1.0s",
            				"dec": "68° 52' 56.9",
            				"story": "Found star using https://www.google.com/sky/"
       			 }
    			},
    			"time": "1543602240",
    			"previousBlockHash": "2535eea01df2a69a5b5b55ddbecfbd00da716fc30bc63b2470e4748e521d4e6b"
		}

**GET Star Block by Hash Endpoint**
GET a star block by hash response returns an entire star block contents with addition of the star story decoded ASCII. The response object includes hash, height, address, star coordinates, time, previousBlock Hash

	Example URL path for GET
	URL: http://localhost:8000/stars/hash:84cb6ed47a1608a02152f87903359ed283734121b4191bc9eb4813440f80f0b0
	
	Response
	The response for the endpoint provides a object in JSON format.

	{
    		"hash": "84cb6ed47a1608a02152f87903359ed283734121b4191bc9eb4813440f80f0b0",
    		"height": 1,
    		"body": {
        		"address": "19xaiMqayaNrn3x7AjV5cU4Mk5f5prRVpL",
        		"star": {
            			"ra": "16h 29m 1.0s",
            			"dec": "68° 52' 56.9",
            			"story": "466f756e642073746172207573696e672068747470733a2f2f7777772e676f6f676c652e636f6d2f736b792f"
        	}
    		},
    		"time": "1543523723",
    		"previousBlockHash": "21f14ac5e566027890e6eddc26c2e2405c73b5db694bb96bd4657db9f9420323"
	}
		
**GET Star Block by Wallet Address Endpoint**
GET a star block by wallet address response returns an entire star block contents with addition of the star story decoded ASCII. The response object includes hash, height, address, star coordinates, time, previousBlock Hash

	Example URL path for GET
	URL: http://localhost:8000/stars/address:19xaiMqayaNrn3x7AjV5cU4Mk5f5prRVpL
	
		
	Response
	The response for the endpoint provides a object in JSON format.

	{
        	"hash": "84cb6ed47a1608a02152f87903359ed283734121b4191bc9eb4813440f80f0b0",
        	"height": 1,
        	"body": {
            	"address": "19xaiMqayaNrn3x7AjV5cU4Mk5f5prRVpL",
            	"star": {
                	"ra": "16h 29m 1.0s",
                	"dec": "68° 52' 56.9",
                	"story": "Found star using https://www.google.com/sky/"
            	}
        	},
        	"time": "1543523723",
        	"previousBlockHash": "21f14ac5e566027890e6eddc26c2e2405c73b5db694bb96bd4657db9f9420323"
    	}
	
**GET Star Block by Block Height Endpoint**
GET a star block by block height response returns an entire star block contents with addition of the star story decoded ASCII. The response object includes hash, height, address, star coordinates, time, previousBlock Hash

	Example URL path for GET
	URL: http://localhost:8000/block/0
	
		
	Response
	The response for the endpoint provides a object in JSON format.

	{
    		"hash": "19dd980fffbc054b53ee883fc4e2a230f3a9f6127fbc2d5b961c2e33c14ee6b0",
    		"height": 0,
    		"body": {
        		"address": "",
        		"star": {
            			"ra": "",
            			"dec": "",
            			"mag": "",
            			"cen": "",
            			"story": "This is the genesis block it does not contain a star"
        		}
    		},
    		"time": "1543587602",
    		"previousBlockHash": ""
	}
	
**Sample Screen using Postman to test API endpoints


![postman example](https://github.com/paramountgroup/Private-Blockchain-Notary-Service/blob/master/images/postmanexample.PNG)



*Running the tests
Tools like postman make testing a simple matter. You can set up fail scenarios such as bad 
signature, star story too many words or too many bytes, and normal testing for the endpoints. Just save these 
endpoint requests in a collection to speed testing time.


## Built With
Express.js - Express is a minimal and flexible Node.js web application framework.

## Versioning
Visual Studio linked to github for version control

## Author
Bob Ingram - Boilerplate code provided by Udacity Blockchain developer course

## License
This project is licensed under the MIT License - see the LICENSE.md file for details

## Acknowledgments
udacity Blockchain developer course, expressjs, stackoverflow

