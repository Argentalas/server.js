//utl module
module.exports = {
	parseurl: parseurl,
	log: log,
	formatDate: formatDate,
	mime: mime,
	rerequire: rerequire
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

	// require() caches and never invalidates, hence this function.
	// Using on native addons will result in an Error. https://nodejs.org/dist/latest-v4.x/docs/api/globals.html#globals_require_cache
	// It is absolutely fine to require smth for the first time with this function.
	// Keep in mind, there is a syncronous file system read under the hood.

	delete require.cache[require.resolve(modname)];
	return require(modname);
};