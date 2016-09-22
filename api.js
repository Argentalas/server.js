//api.js

var bcrypt = require('bcrypt');

const utl = require('./utl.js');
const db = require('./db.js');
const cfg = require('./config.json');
const commands = require('./commands.js');

api.switch = apiSwitch;
api.register = register;

for (c in commands) {
	api[c] = commands[c];
};

module.exports = api;

///////////////////////////

function register(req, res) {
	var msg = req.msg;

	if (msg.username in db.private('users')) {
		res.sendCode(400, 'username taken');
		return;
	};

	bcrypt.hash(msg.token, cfg.saltRounds, (err,hash)=>{
		if (err) {
			res.sendCode(500); 
			utl.log(`bcrypt error ${err}`);
			return;
		};
		db.private('users', msg.username, {token:hash, permissions:''});
		res.sendCode(200);
	});
}

function api(req, res) {

	var command = utl.parseurl(req.url)[1];
	var username = utl.parseurl(req.url)[2];

	if (!authorized(command, username)) {res.sendCode(403); return};

	req.msg=[];

	req.on('error', (err)=>{
		utl.log(err);
		res.sendCode(400);
	}).on('data', (d)=>{
		req.msg.push(d);
	}).on('end', ()=>{
		try {
			req.msg = JSON.parse(Buffer.concat(req.msg).toString());
		} catch(e) {
			res.sendCode(400, 'post data must be valid json');
			utl.log(e.message);
			return;
		};
		authenticate(username, req.msg.token, res, req, ()=>{
			api[command](req, res);
		});
	});

};

function authenticate(username, token, res, req, cb) {
	token = token || '';

	bcrypt.compare(token, db.private('users', username).token, (err,result)=>{
		if (err) {
			res.sendCode(400);
			utl.log(`bcrypt error ${err.message}`);
		} else if (!result) {
			res.sendCode(403);
			utl.log(`failed authentification for user ${username} from ${req.connection.remoteAdress}`);
		} else {
			cb();
		}
	});
};

function authorized(command, username) {

	const users = db.private('users');

	return (username in users && command in users[username].permissions);

};



function apiSwitch(req) {
	return (utl.parseurl(req.url)[0] === 'api' && req.method === 'POST');
};