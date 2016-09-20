//api.js
var bcrypt = require('bcrypt');

const utl = require('./utl.js');

module.exports = api;

///////////////////////////

function api(req, res) {
	var command = utl.parseurl(req.url)[1];
	var username = utl.parseurl(req.url)[2];

};

function authenticate(token, req) {

	bcrypt.compare(token)
};

function authorize(command, username) {
	try {
		return command in db.sec(users, username).permissions;
	} catch (e){
		utl.log(e);
		return false;
	};
};