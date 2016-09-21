//api.js

var bcrypt = require('bcrypt');

const utl = require('./utl.js');

api.switch = apiSwitch;

module.exports = api;

///////////////////////////

function api(req, res) {

	var command = utl.parseurl(req.url)[1];
	var username = utl.parseurl(req.url)[2];

	if (!authorized(command, username)) {sendCode(403, res)};

	var msg=[];

	req.on('error', (err)=>{
		utl.log(err);
		sendCode(res, 400);
	}).on('data', (d)=>{
		msg.push(d);
	}).on('end', ()=>{
		msg = JSON.parse(Buffer.concat(msg).toString());
		authenticate(username, msg.token, res, req, ()=>{
			api[command](msg, res);
		});
	});

};

function authenticate(username, token, res, req, cb) {
	token = token || '';

	bcrypt.compare(token, db.private(users, username).token, (err,result)=>{
		if (err) {
			sendCode(400, res);
			utl.log(`bcrypt error ${err}`);
		} else if (!result) {
			sendCode(403, res);
			utl.log(`failed authentification for user ${username} from ${req.connection.remoteAdress}`);
		} else {
			cb();
		}
	});
};

function authorized(command, username) {

	const users = db.private(users);

	return (username in users && command in users[username].permissions);

};

function sendCode(code, res, text) {
	res.writeHead(code, {'Content-Type':'text/plain'});
	res.end(text || '');
};

function apiSwitch(req) {
	return (utl.parseurl(req.url)[0] === 'api' && req.method === 'POST');
};