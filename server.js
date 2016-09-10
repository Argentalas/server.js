const http = require('http');
const fs = require('fs');
const path = require('path');

const utl = require('./utl.js');

var cfg;

const server = http.createServer(main);

fs.watch('config.json', init);

init();

// Only declarations below //
/////////////////////////////

function init() {
	server.close();
	cfg = utl.rerequire('./config.json');
	for (m in cfg.modules){
		global[m] = utl.rerequire(cfg.modules[m]);
	};
	server.listen(cfg.port, cfg.ip, ()=>{utl.log(`${cfg.appName} started at ${cfg.ip}:${cfg.port}`)});
};

function main(req, res) {

	utl.log(req.url, req.connection.remoteAddress);

	if(utl.parseurl(req.url)[0] === 'api'){
		api(req, res);
	}else{
		static(req, res);
	};
};

function static(req, res) {
	if (req.url==='/') {req.url='/index.html'};

	// Status code and content type will be overwritten with res.writeHead() in case of error
	res.statusCode = 200;
	res.setHeader('Content-Type', utl.mime(req.url));

	// Reads file requested in url and pipes it into response
	fs.createReadStream(cfg.publicFolder+req.url).on('error',(err)=>{
		utl.log(err.message);
		res.writeHead(404, {'Content-Type':'text/plain'});
		res.end('404 Not Found');
	}).pipe(res);
};
