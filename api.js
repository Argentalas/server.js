const utl = require('./utl.js');

module.exports = api;

function api(req, res) {
	var command = utl.parseurl(req.url)[1];
	var token = utl.parseurl(req.url)[2];

};