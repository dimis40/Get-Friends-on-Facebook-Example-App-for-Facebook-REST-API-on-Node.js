var request = require('request')
  , qs = require('qs');

var callbackURL = 'http://'+process.env.OPENSHIFT_APP_DNS+'/callback'
  , APP_ID = 'FACEBOOK_APP_ID'
  , APP_SECRET = 'FACEBOOK_APP_SECRET';

function login(req, res) {
	req.session.oauth = {};
	req.session.oauth.state = (Math.floor(Math.random()*1e19));
	
	var params = {
		client_id: APP_ID,
		redirect_uri: callbackURL,
		state: req.session.oauth.state,
		display: 'popup'
	};

	params = qs.stringify(params);
	res.end('https://www.facebook.com/dialog/oauth?'+params);
}

function callback(req, res) {
	var code = req.query.code
    , state = req.query.state
    , errorreason = req.query.error_reason
    , error = req.query.error;

	if (state == req.session.oauth.state) {

		if (code !== undefined) {
      
			var url = 'https://graph.facebook.com/oauth/access_token';
      var params = {
				client_id: APP_ID,
				redirect_uri: callbackURL,
				client_secret: APP_SECRET,
				code: code
			};
      
			request.get({url:url, qs:params}, function(err, resp, body) {
				var results = qs.parse(body);
				req.session.oauth.access_token = results.access_token;
				req.session.oauth.expires = results.expires;

				console.log("Connected to Facebook");
				// close the popup
				var output = '<html><head></head><body onload="window.close();">Closing this window</body></html>';
				res.writeHead(200, {'Content-Type': 'text/html'});
				res.end(output);
			});

		} else {
			console.error('Code is undefined: '+code);
			console.error('Error: '+ error + ' - '+ errorreason);
		}

	} else {
		console.error('Mismatch with variable "state"');
		res.redirect('/');
	}
}

exports.login = login;
exports.callback = callback;