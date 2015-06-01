// BASE SETUP
// ============================================

// CALL THE PACKAGES --------------------

var express = require('express'), // Call Express
  app = express(), // Define app
  bodyParser = require('body-parser'), // Get body parser
  morgan = require('morgan'), // Used to see requests
  mongoose = require('mongoose'), // For working with Mongo
  jwt = require('jsonwebtoken'), // A way of performing auth
  User = require('./app/models/user'); // User Model
var config = require('./config.js');

var path = require('path');

mongoose.connect(config.database);

mongoose.connection.on("connected", function() {
  console.log("Connected to DB");
});

mongoose.connection.on("error", function(err) {
    console.log("Mongoose did not connect " + err);
  })
  // App Configuration ---------------------

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());

// Configure app to handle CORS(Cross Origin Resource Sharing) requests

app.use(function(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, content-type, \ Authorization');
  next();
});

app.use(morgan('dev'));

app.use(express.static(__dirname + '/public'));

// ROUTES FOR OUR API ------------------

var apiRoutes = require('./app/routes/api.js')(app, express);
app.use('/api', apiRoutes);

app.get('*', function(req, res) {
  res.sendFile(path.join(__dirname + '/public/app/views/index.html'));
});

app.listen(config.port);
console.log("Magic happens on port " + config.port);
