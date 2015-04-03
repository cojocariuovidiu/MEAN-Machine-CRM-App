// BASE SETUP
// ============================================

// CALL THE PACKAGES --------------------

var express = require('express'), // Call Express
	app = express(), // Define app
	bodyParser = require('body-parser'), // Get body parser
	morgan = require('morgan'), // Used to see requests
	mongoose = require('mongoose'), // For working with Mongo
	User = require('app/models/user'); // User Model
	port = process.env.PORT || 8080; // Set port to 8080

// Database Connect ----------------------

mongoose.connect(localhost:27017/myDatabase);


// App Configuration ---------------------

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Configure app to handle CORS(Cross Origin Resource Sharing) requests

app.use(function(req, res, next){
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
	res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, content-type, \ Authorization');
	next();
});

app.use(morgan('dev'));

// ROUTES FOR OUR API ------------------

// Homepage Route

app.get('/', function(req, res){
	res.send('Welcome to the homepage');
});


// Get an instance of the api router

var apiRouter = express.Router();


// Test route to make sure everything is working
// Accessed at GET http://localhost:8080/api

apiRouter.get('/', function(req,res){
	res.json({ message: 'Welcome to api'});
});

// More routes for API will go here

// REGISTER OUR ROUTES ---------------------
// All routes will be prefixed with /api
app.use('/api', apiRouter);


app.listen(port);
console.log("Magic happens on port " + port);

