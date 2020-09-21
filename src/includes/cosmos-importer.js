var os = require('os'),
	fs = require('fs'),
	path = require('path'),
	unzipper = require('unzipper'),
	slugify = require('slugify'),
	findRemoveSync = require('find-remove'),
	rimraf = require('rimraf'),
	_ = require('lodash'),
	database = require('./database');

module.exports = CosmosImporter = function({ file, created_by }) {
	this.file = file;
	this.created_by = created_by;
	this.cleanup();
}


/**
 * Remove old imported files
 *
 */
CosmosImporter.prototype.cleanup = function() {
	const tmpPath = path.join(process.cwd(), "data", "tmp");
	var result = findRemoveSync(tmpPath, {
		age: { seconds: 3600 },
		extensions: '.zip',
		limit: 10
	});
}


/**
 * Create a new project entry to get the new ID.
 *
 */
CosmosImporter.prototype.createProject = function(data) {

	var sql = "INSERT INTO `cosmos` (name, created_at, created_by) VALUES (null, $created_at, $created_by)";

	const created_at = new Date().toISOString()
		.replace(/T/, ' ')
		.replace(/\..+/, '');

	const params = {
		$created_by: data.created_by,
		$created_at: created_at,
	};

	var db = database.getDb();
	var stmt = db.prepare(sql);

	return new Promise((resolve, reject) => {
		stmt.run(params, (err) => {
			if (err) {
				reject(err.toString());
			}
			data = {...data, id: parseInt(stmt.lastID.toString(), 10) }
			resolve(data);
		});
	});

/*	console.log("Creating project...");

	if ( ! fs.existsSync(path.join(this.tmpDir, 'project.json'))) {
		console.error('No project.json');
		throw new Error("No project data found in zip file.");
	}

	var project = require(path.join(this.tmpDir, "project.json"));
	project.data = JSON.stringify(project.data);
	console.log(project);

	return true;*/
/*
	return new Promise((resolve, reject) => {

		return fs.createReadStream(this.file.path)
			.pipe(unzipper.ParseOne(/project\.json/gm))
			.pipe((content) => {
				console.log(content);
			})
			.on('finish', resolve)
			.on('error', reject);
	});*/
}


/**
 * Extract all files from zip to destination folder based on project ID.
 *
 */
CosmosImporter.prototype.extract = function(data) {

	const exPath = path.join(process.cwd(), "data", "images", "" + data.id);
	data = {...data, exPath };

	return new Promise((resolve, reject) => {
		fs.createReadStream(data.file.path)
			.pipe(unzipper.Extract({ path: exPath }))
			.on('close', () => {
				resolve(data);
			});
	});
}


CosmosImporter.prototype.importData = function(data) {

	const jsonPath = path.join(data.exPath, 'project.json');
	console.log(jsonPath);

	if ( ! fs.existsSync(jsonPath)) {
		throw new Error("No project.json file found.");
	}

	const projectData = require(jsonPath);

	const params = {
		$id: data.id,
		$name: projectData.name,
		$slug: projectData.slug,
		$data: JSON.stringify(projectData.data),
	};

	var db = database.getDb();
	var sql = "UPDATE `cosmos` SET name = $name, slug = $slug, data = $data WHERE id = $id";
	var stmt = db.prepare(sql);

	return new Promise((resolve, reject) => {
		stmt.run(params, (err) => {

			if (err) {
				reject(err.toString());
			}

			fs.unlink(jsonPath, (err) => {
				if (err) {
					reject(err.toString());
				}
			});

			resolve(data);

		});
	});
}


CosmosImporter.prototype.cleanupAfterFailure = function(data) {

	const deleteDir = new Promise((resolve, reject) => {
		rimraf(data.exPath, (err) => {
			if (err) reject(err);
			console.log(`Removed ${data.exPath}...`);
			resolve(true);
		});
	});

	const deleteRow = new Promise((resolve, reject) => {

		var sql = "DELETE FROM `cosmos` WHERE id = $id";
		var db = database.getDb();
		var stmt = db.prepare(sql);

		var params = { $id: data.id };

		return new Promise((resolve,reject) => {
			stmt.run(params, (err) => {
				if (err) { reject(err); }
				console.log(`Deleted row ${data.id}...`);
				resolve(true);
			});
		});

	});

	return Promise.all([deleteDir, deleteRow]);
}



/**
 * Bundle the files+data and return the name & path of the zip file.
 *
 */
CosmosImporter.prototype.import = function() {

	var data = {
		file: this.file,
		created_by: this.created_by,
	};

	return this.createProject(data)
		.then((pdata) => data = {...pdata})
		.then(this.extract)
		.then((pdata) => data = {...pdata})
		.then(this.importData)
		.catch((err) => {
			this.cleanupAfterFailure(data);
			throw err;
		});
}
