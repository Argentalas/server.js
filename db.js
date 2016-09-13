//db.js
const fs = require('fs');

const utl = require('./utl.js');

module.exports = db;

///////////////////////

function db(rel, pkey, value) {

	// If no arguments provided return list of relations (a.k.a. tables)
	var l = fs.readdirSync('data');
	if (arguments.length === 0) {return l};

	// If only one argument provided return entire table
	if (l.indexOf(rel+'.json') === -1) {return 'table not found'};
	var r = JSON.parse(fs.readFileSync(`data/${rel}.json`));
	if (arguments.length === 1) {return r};

	// If two arguments provided return requested value
	if (arguments.length === 2) {return r[pkey] || 'entry not found'};

	// If at least three arguments provided then write provided value to the database
	r[pkey] = value;
	fs.writeFileSync(`data/${rel}.json`, JSON.stringify(r));
}

//This is a relic and will be deleted
//////////////////////////////////////////

function write(rel, pkey, value) {
	
};

function read(rel, pkey) {

	var result = new EE();

	// If no arguments provided return list of relations (a.k.a. tables)
	if (!arguments.length) {
		fs.readdir('data', (err,files)=>{
			if (err) {
				utl.log(err);
				result.emit('error', err);
			} else {
				result.emit('done', files);
			}
		});
		return result;
	};

	fs.readFile(`data/${rel}.json`, (err, d)=>{
		
		if (err) {
			utl.log(err);
			result.emit('error', err);
		} else if (arguments.length < 2){
		
			// If no pkey provided return entire object
			result.emit('done', JSON.parse(d));
		
		} else {
			result.emit('done', JSON.parse(d)[pkey] || '');
		};
	});

	return result;
};