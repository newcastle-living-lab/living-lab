var os = require('os'),
	fs = require('fs'),
	path = require('path'),
	unzipper = require('unzipper'),
	rimraf = require('rimraf'),
	_ = require('lodash/core'),
	database = require('./database'),
	helpers = require('./helpers'),
	projectHelper = require('./projectHelper.js');



var project = null,
	file = null,
	tmpDir = null,
	db = null;


function init(_file) {
	file = _file;
	tmpDir = path.join(process.cwd(), "data", "tmp", file.name.replace(".zip", ""));
	db = database.getDb();
}


function mkdir(dir) {
	return new Promise(function(resolve, reject) {
		fs.mkdir(dir, function(err) {
			if (err && err.code != 'EEXIST') {
				return reject(err);
			} else {
				return resolve(dir);
			}
		});
	});
}


/**
 * Create temporary dirs that will be zipped up.
 *
 */
function createDirs() {
	return mkdir(tmpDir);
}


function extractZip() {
	return fs.createReadStream(file.path)
		.pipe(unzipper.Extract({ path: tmpDir }));
}


function verifyUpload() {

}


function cleanup() {
	rimraf(tmpDir, function(err) {});
}


/**
 * Run import
 *
 */
function importProject(cb) {
	createDirs()
		.then(function() {
			return extractZip();
		})
		.then(function(zip) {
			// cleanup();
			cb(null, {
				success: true,
			});
		})
		.catch(function(err) {
			console.log(err);
			cb(err, { success: false });
		})
}


module.exports = {
	init: init,
	import: importProject
};
