var bodyParser = require('body-parser'), // Get body parser
  jwt = require('jsonwebtoken'), // A way of performing auth
  User = require('../models/user'); // User Model

var config = require('../../config.js');

var superSecret = config.secret;

module.exports = function(app, express) {
  var apiRouter = express.Router();

  apiRouter.post('/authenticate', function(req, res) {
    User.findOne({
      username: req.body.username,
    }).select('name username password').exec(function(err, user) {
      if (err) throw err;

      // No user with that user was found
      if (!user) {
        res.json({
          success: false,
          message: 'Authentication failed. User not found.'
        });
      } else if (user) {

        // Check if password matches
        var validPassword = user.comparePassword(req.body.password);
        if (!validPassword) {
          res.json({
            success: false,
            message: 'Authentication failed. Wrong password.'
          });
        } else {

          // If user is found and password is right

          // Create a token
          var token = jwt.sign({
            name: user.name,
            username: user.username
          }, superSecret, {
            expiresInMinutes: 1440 // Expires in 24 hours
          });

          res.json({
            success: true,
            message: 'Enjoy your token!',
            token: token
          });
        }
      }
    });
  });

  app.use(function(req, res, next) {

    // check header or url parameters or post parameters for token”
    var token = req.body.token || req.param('token') || req.headers['x-access-token'];

    // decode token
    if (token) {

      // verifies secret and checks exp
      jwt.verify(token, superSecret, function(err, decoded) {
        if (err) {
          return res.status(403).send({
            success: false,
            message: 'Failed to authenticate token'
          });
        } else {

          // if everything is good save the request for use in other routes
          req.decoded = decoded;
          next();
        }
      });
    } else {

      // if there is no token return a http response
      // of 403(access forbidden) and error message

      return res.status(403).send({
        success: false,
        message: 'No token provided'
      });

    }
  });

  // Test route to make sure everything is working
  // Accessed at GET http://localhost:8080/api

  apiRouter.get('/', function(req, res) {
    res.json({
      message: 'Welcome to api'
    });
  });


  /*
   * Notes
   * These routes can later be changes to call a controller where the body of these functions
   * would go
   */
  // All routes related to all users
  apiRouter.route('/users')

  // create a user (accessed at POST http://localhost:8080/api/users)”
  .post(function(req, res) {
      //Create a new instance of the user model
      var user = new User();

      //Set the users information from the request
      user.name = req.body.name;
      user.username = req.body.username;
      user.password = req.body.password;

      //Save the user and check for errors
      user.save(function(err) {
        if (err) {
          // duplicate entry
          if (err.code == 11000) {
            return res.json({
              success: false,
              message: 'A user with that username already exists'
            });
          } else {
            return res.send(err);
          }
        }
        res.json({
          message: "User created"
        });
      });
    })
    // get all the users (accessed at GET http://localhost:8080/api/users)
    .get(function(req, res) {
      //Query DB for a list of users
      User.find(function(err, users) {
        if (err) {
          //If error send error
          res.send(err);
        } else {
          //If no error send list of users
          res.json(users);
        }

      });
    });
  // All routes related to individual users
  apiRouter.route('/users/:user_id')
    .get(function(req, res) {
      User.findById(req.params.user_id, function(err, user) {
        if (err) {
          res.send(err);
        } else {
          res.json(user);
        }
      });
    })
    .put(function(req, res) {
      User.findById(req.params.user_id, function(err, user) {
        if (err) {
          res.send(err);
        }
        // If you pass in an updated value for the given field
        // it will update the database, otherwise the value that
        // was previously set will remain
        if (req.body.name) {
          user.name = req.body.name;
        }
        if (req.body.username) {
          user.username = req.body.username;
        }
        if (req.body.password) {
          user.password = req.body.password;
        }
        user.save(function(err) {
          if (err) {
            res.send(err);
          } else {
            res.send("Successfully updated user information");
          }
        })
      })
    })
    .delete(function(req, res) {
      User.remove({
        _id: req.params.user_id
      }, function(err, user) {
        if (err) return res.send(err);
        res.json({
          message: "Successfully Deleted"
        });
      })
    })
  apiRouter.get('/me', function(req, res) {
    res.send(req.decoded);
  });
  return apiRouter;
}
