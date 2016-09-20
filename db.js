//db.js

const fs = require('fs');

db.sec = secure;

module.exports = db;

///////////////////////

function db(rel, pkey, value) {

	// If no arguments provided return list of relations (a.k.a. tables :-) )
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
};

function secure(rel, pkey, value) {

	// If no arguments provided return list of relations (a.k.a. tables :-) )
	var l = fs.readdirSync('private');
	if (arguments.length === 0) {return l};

	// If only one argument provided return entire table
	if (l.indexOf(rel+'.json') === -1) {return 'table not found'};
	var r = JSON.parse(fs.readFileSync(`private/${rel}.json`));
	if (arguments.length === 1) {return r};

	// If two arguments provided return requested value
	if (arguments.length === 2) {return r[pkey] || 'entry not found'};

	// If at least three arguments provided then write provided value to the database
	r[pkey] = value;
	fs.writeFileSync(`private/${rel}.json`, JSON.stringify(r));
};