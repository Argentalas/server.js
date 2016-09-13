//db.js
const fs = require('fs');
const EE = require('events');

const utl = require('./utl.js');

db.write = write;
db.read = read;

module.exports = db;

///////////////////////

function db() {
	// Reserved for queries to sql dbms
}

function write(rel, pkey, value) {
	
};

function read(rel, pkey) {

	var result = new EE();

	// If no arguments provided return list of relations (a.k.a. tables)
	if (!arguments.length) {
		fs.readdir('data', (err,files)=>{
			if (err) {
				utl.log(err);
				result.emit('done', err);
			} else {
				result.emit('done', files);
			}
		});
		return result;
	};

	fs.readFile(`data/${rel}.json`, (err, d)=>{
		if (err) {
			utl.log(err);
			result.emit('done', err);
		} else if (arguments.length < 2){
			result.emit('done', JSON.parse(d));
		} else {
			result.emit('done', JSON.parse(d)[pkey]);
		};
	});
	
	return result;
};