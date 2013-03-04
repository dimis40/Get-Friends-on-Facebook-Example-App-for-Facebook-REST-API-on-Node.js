var express = require('express')
  , api = require('./getfriends')
  , oauth = require('./oauth')
  , app = express();

// Setup middleware
app.use(express.static(__dirname));

var access_token = oauth.access_token;

app.get('/getfriends', function(req, res) {
  // Check to ensure user has a valid access_token
  if (access_token) {

      // Retrieve list of facebook friends (see 'getfriends.js')
      api.getFriends(access_token, res);
  
  } else {
      console.log("Couldn't verify if user was authenticated. Redirecting to /");
      res.redirect('/');
  }

});

// Routes for OAuth calls
app.get('/login', oauth.login);
app.get('/callback', oauth.callback);

app.listen(process.env.OPENSHIFT_NODEJS_PORT, process.env.OPENSHIFT_NODEJS_IP);
