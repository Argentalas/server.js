//db.js

const fs = require('fs');

db.write = write;
db.read = read;

module.exports = db;

///////////////////////

function db() {
	// Reserved for sql
}

function write(rel, pkey, value) {
	
};

function read(rel, pkey) {

	if (!rel) {
		
	};

	fs.readFile(`data/${rel}.json`, (err,data)=>{

	})

};

