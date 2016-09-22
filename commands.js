//commands.js

// Add your commands here.
// Core api methods are located in api.js module.

module.exports = {

	echo: function(request, response){

		// request.msg property contains json sent to api.
		var msg = request.msg;

		//response.send(json) method sends back json; you can also use utl.send(json, response) or full functionality of http.ServerResponse https://nodejs.org/dist/latest-v4.x/docs/api/http.html#http_class_http_serverresponse
		response.send(msg);
	}
};