//api.js
var bcrypt = require('bcrypt');

const utl = require('./utl.js');

module.exports = api;

///////////////////////////

function api(req, res) {

	if (utl.parseurl(req.url)[0] === 'api') {return false};

	var command = utl.parseurl(req.url)[1];
	var username = utl.parseurl(req.url)[2];

	

	return true;
};

function authenticate(token, req) {

	bcrypt.compare(token)
};

function authorize(command, username) {
	try {
		return command in db.private(users, username).permissions;
	} catch (e){
		utl.log(e);
		return false;
	};
};