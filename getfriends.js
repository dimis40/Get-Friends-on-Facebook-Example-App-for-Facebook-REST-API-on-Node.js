var request = require('request');

function getFriends(access_token, response) {

  
  // Specify the URL and query string parameters needed for the request
  var url = 'https://graph.facebook.com/me/friends';
  var qs = {
    fields: 'name,picture',
    access_token: access_token
  };

  // Send the request
  request.get({url:url, qs:qs}, function(err, resp, friends) {

    friends = JSON.parse(friends);
    var output = '<table>'
      , picture = ''
      , name = '';
      
    // Go through list of friends and generate output
    for (var i=0; i < friends.data.length; i++) {
	  picture = friends.data[i].picture.data.url;
	  name = friends.data[i].name;
	  output += '<tr><td><img src="' + picture + '"</td><td><strong>' + name + '</strong></td></tr>';
	}

    // Send the output as response
    response.end(output + '</table>');
  });
}

exports.getFriends = getFriends;