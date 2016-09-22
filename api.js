//api.js

var bcrypt = require('bcrypt');

const utl = require('./utl.js');
const db = require('./db.js');
const cfg = require('./config.js');
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

	if (msg.username in db.private(users)) {
		utl.sendCode(400, res, 'username taken');
		return;
	};

	bcrypt.hash(msg.token, cfg.saltRounds, (err,hash)=>{
		if (err) {
			utl.sendCode(500, res); 
			utl.log(`bcrypt error ${err}`);
			return;
		};
		db.private(users, msg.username, {token:hash, permissions:''});
		utl.sendCode(200, res);
	});
}

function api(req, res) {

	var command = utl.parseurl(req.url)[1];
	var username = utl.parseurl(req.url)[2];

	if (!authorized(command, username)) {utl.sendCode(403, res); return};

	req.msg=[];

	req.on('error', (err)=>{
		utl.log(err);
		utl.sendCode(res, 400);
	}).on('data', (d)=>{
		req.msg.push(d);
	}).on('end', ()=>{
		req.msg = JSON.parse(Buffer.concat(req.msg).toString());
		authenticate(username, req.msg.token, res, req, ()=>{
			res.send = utl.send;
			api[command](req, res);
		});
	});

};

function authenticate(username, token, res, req, cb) {
	token = token || '';

	bcrypt.compare(token, db.private(users, username).token, (err,result)=>{
		if (err) {
			utl.sendCode(400, res);
			utl.log(`bcrypt error ${err}`);
		} else if (!result) {
			utl.sendCode(403, res);
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



function apiSwitch(req) {
	return (utl.parseurl(req.url)[0] === 'api' && req.method === 'POST');
};