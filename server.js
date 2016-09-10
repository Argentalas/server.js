const http = require('http');
const fs = require('fs');
const path = require('path');

var cfg;

const server = http.createServer(main);

fs.watch('config.json', init);

init();

// Only declarations below //
/////////////////////////////

function init() {
	server.close();
	cfg = rerequire('./config.json');
	for (m in cfg.modules){
		rerequire(cfg.modules[m]);
	};
	server.listen(cfg.port, cfg.ip, ()=>{log(`${cfg.appName} started at ${cfg.ip}:${cfg.port}`)});
};

function main(req, res) {

	log(req.url, req.connection.remoteAddress);

	if(parseurl(req.url)[0] === 'api'){
		api(req, res);
	}else{
		static(req, res);
	};
};

function api(req, res) {
	var command = parseurl(req.url)[1];
	var token = parseurl(req.url)[2];

};

function static(req, res) {
	if (req.url==='/') {req.url='/index.html'};

	// Status code and content type will be overwritten with res.writeHead() in case of error
	res.statusCode = 200;
	res.setHeader('Content-Type', mime(req.url));

	// Reads file requested in url and pipes it into response
	fs.createReadStream(cfg.publicFolder+req.url).on('error',(err)=>{
		log(err.message);
		res.writeHead(404, {'Content-Type':'text/plain'});
		res.end('404 Not Found');
	}).pipe(res);
};

function parseurl(url) {
	
	return url.split('/').slice(1);
};

function log() {
	var args = Array.from(arguments);
	args.unshift('['+formatDate(Date.now())+']');
	console.log.apply(this, args);
};

function formatDate(timestamp){

	// Returns number. Sample output: 160905134321,
	// where 16 - year, 09 - month, 05 - date, 13 - hours, 43 - minutes, 21 - seconds.
	// Each part is always 2-digit, so total length is fixed.

	var d = new Date(timestamp);
	return parseInt(d.getUTCFullYear().toString().substr(-2) +
		('0'+(d.getUTCMonth()+1).toString()).substr(-2) +
		('0'+d.getUTCDate().toString()).substr(-2) +
		('0'+d.getUTCHours().toString()).substr(-2) +
		('0'+d.getUTCMinutes().toString()).substr(-2) +
		('0'+d.getUTCSeconds().toString()).substr(-2));
};

function mime(filePath) {
	//nb: mime-types, node-mime
	return cfg.typeDic[path.extname(filePath)] || '';
};

function rerequire(modname) {

	// require() caches, hence this function.
	// Using on native addons will result in an Error. https://nodejs.org/dist/latest-v4.x/docs/api/globals.html#globals_require_cache
	// It is absolutely fine to require smth for the first time with this function.
	// Keep in mind, there is a syncronous file system read under the hood.

	delete require.cache[require.resolve(modname)];
	return require(modname);
};