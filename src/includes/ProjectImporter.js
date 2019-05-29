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

	var dirName = path.basename(file.path).replace('.zip', '');
	tmpDir = path.join(process.cwd(), "data", "tmp", dirName);
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
 * Create temporary dirs where files will be extracted to.
 *
 */
function createDirs() {
	return mkdir(tmpDir);
}


/**
 * Extract the zip contents to temp dir
 *
 */
function extractZip() {
	return new Promise(function(resolve, reject) {
		return fs.createReadStream(file.path)
			.pipe(unzipper.Extract({ path: tmpDir }))
			.on('close', function() {
				return resolve();
			});
	});
}


/**
 * Check that the extracted contents contains the files we expect.
 *
 */
function verifyUpload() {

	return new Promise(function(resolve, reject) {
		var hasProjectData = fs.existsSync(path.join(tmpDir, "project.json")),
			hasProjectJson = fs.existsSync(path.join(tmpDir, "project-data.json")),
			hasResources = fs.existsSync(path.join(tmpDir, "resources.json"));

		if (hasProjectData && hasProjectJson && hasResources) {
			return resolve();
		} else {
			return reject("No project data found in zip file.");
		}
	});

}


/**
 * Create a new Project entry in the DB for this imported project.
 *
 */
function createProject() {

	return new Promise(function(resolve, reject) {

		var proj = require(path.join(tmpDir, "project.json"));
		var projData = require(path.join(tmpDir, "project-data.json"));

		var sql,
			params,
			insid;

		sql = "INSERT INTO Projects (name, createdate, lastdate, creator, json) VALUES ($name, $createdate, $lastdate, $creator, $state)";

		params = {
			$name: proj.name,
			$createdate: proj.createdate,
			$lastdate: proj.lastdate,
			$creator: proj.creator,
			$state: JSON.stringify(projData)
		};

		return db.run(sql, params, function(error) {

			if (error) {
				return reject(error);
			}

			db.each("SELECT last_insert_rowid() AS id FROM Projects", function(err, row) {
				insid = row.id;
			}, function(err, rows) {

				if (err) {
					return reject(err);
				}

				projectHelper.createPlayerEntry({
					name: proj.name,
					id: insid
				}, function(err, data) {
					//
				});

				project = proj;
				project.id = insid;

				return resolve();

			});

		});

	});

}


/**
 * Insert any resources we have into the database.
 *
 */
function insertResources() {

	return new Promise(function(resolve, reject) {

		var resData = require(path.join(tmpDir, "resources.json")),
			res;

		var sql,
			params;

		var sql = "INSERT INTO Resources (name, type, jsonstate) VALUES ($name, $type, $state)";

		db.serialize(function() {

			for (var i = 0; i < resData.resources.length; i++) {

				res = resData.resources[i];

				var params = {
					$name: res.name,
					$type: res.type,
					$state: res.jsonstate,
				};

				db.run(sql, params);
			}

		});

		return resolve();

	});

}


function copyResources() {

	return new Promise(function(resolve, reject) {

		var resData = require(path.join(tmpDir, "resources.json")),
			file,
			i,
			p,
			promises = [];

		for (i = 0; i < resData.files.length; i++) {
			// Copy file
			file = resData.files[i];
			filename = file.replace("resources/", "");
			srcFile = path.join(tmpDir, "resources", filename);
			dstFile = path.join(process.cwd(), "data", "resources", filename);
			promises.push(helpers.copyFile(srcFile, dstFile));
		}

		Promise.all(promises).then(function() {
			resolve();
		});

	});

}


function cleanup() {
	rimraf(file.path, function(err) {});
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
		.then(function() {
			return verifyUpload();
		})
		.then(function() {
			return createProject();
		})
		.then(function() {
			return insertResources();
		})
		.then(function() {
			return copyResources();
		})
		.then(function() {
			cleanup();
			cb(null, {
				'success': true,
				'project': project,
			});
		})
		.catch(function(err) {
			cleanup();
			console.log(err);
			cb(err, { 'success': false, 'error': err });
		});
}


module.exports = {
	init: init,
	import: importProject
};
