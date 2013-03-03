var express = require('express')
  , api = require('./getfriends')
  , app = express();

// Setup middleware
app.use(express.cookieParser('friend much?'));
app.use(express.session());
app.use(express.static(__dirname));

app.get('/getfriends', function(req, res) {
  // Check to ensure user has a valid access_token
  if (req.session.oauth && req.session.oauth.access_token) {

      // Retrieve list of facebook friends (see 'getfriends.js')
      api.getFriends(req.session.oauth.access_token, res);
  
  } else {
      console.log("Couldn't verify if user was authenticated. Redirecting to /");
      res.redirect('/');
  }

});

// Routes for OAuth calls
var oauth = require('./oauth');
app.get('/login', oauth.login);
app.get('/callback', oauth.callback);

app.listen(process.env.OPENSHIFT_NODEJS_PORT, process.env.OPENSHIFT_NODEJS_IP);
