var request = require('request')
  , qs = require('qs');

var callbackURL = 'http://'+process.env.OPENSHIFT_APP_DNS+'/callback'
  , APP_ID = 'FACEBOOK_APP_ID'
  , APP_SECRET = 'FACEBOOK_APP_SECRET';


var access_token = '';
var expires = '';
var state = '';


function login(req, res) {
  
	state = Math.floor(Math.random()*1e19);
  exports.state = state;
	
	var params = {
		client_id: APP_ID,
		redirect_uri: callbackURL,
		state: state,
		display: 'popup'
	};

	params = qs.stringify(params);
	res.end('https://www.facebook.com/dialog/oauth?'+params);
}

function callback(req, res) {
	var code = req.query.code
    , cb_state = req.query.state
    , errorreason = req.query.error_reason
    , error = req.query.error;

	if (state == cb_state) {

		if (code !== undefined) {
      
			var url = 'https://graph.facebook.com/oauth/access_token';
      var params = {
				client_id: APP_ID,
				redirect_uri: callbackURL,
				client_secret: APP_SECRET,
				code: code
			};
      
			request.get({url:url, qs:params}, function(err, resp, body) {
        // Handle any errors that may occur
        if (err) return console.error("Error occured: ", err);
				var results = qs.parse(body);
        if (results.error) return console.error("Error returned from Facebook: ", results.error);
        
        // Retrieve access_token and store for future use
				access_token = results.access_token;
				expires = results.expires;
        exports.access_token = access_token;
        exports.expires = expires;
        
				console.log("Connected to Facebook");

        // Close the popup
				var output = '<html><head></head><body onload="window.close();">Closing this window</body></html>';
				res.writeHead(200, {'Content-Type': 'text/html'});
				res.end(output);
			});

		} else {
			console.error('Code is undefined: '+code);
			console.error('Error: '+ error + ' - '+ errorreason);
		}

	} else {
		console.error('Mismatch with variable "state"; redirecting to /');
		res.redirect('/');
	}
}

exports.login = login;
exports.callback = callback;

