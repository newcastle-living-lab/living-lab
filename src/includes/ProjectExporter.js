var os = require('os'),
	fs = require('fs'),
	path = require('path'),
	archiver = require('archiver'),
	rimraf = require('rimraf'),
	_ = require('lodash/core'),
	database = require('./database'),
	helpers = require('./helpers'),
	projectHelper = require('./projectHelper.js');



var project = null,
	db = null;


function init(_project) {
	project = _project;
	db = database.getDb();
}


function getDirName() {
	return "project-" + project.id;
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
	return mkdir(path.join(process.cwd(), "data", "export"))
		.then(mkdir(path.join(process.cwd(), "data", "export", getDirName())))
		.then(mkdir(path.join(process.cwd(), "data", "export", getDirName(), "resources")));
}


/**
 * Save metadata to JSON
 *
 */
function buildMetaJson() {

	return new Promise(function(resolve, reject) {

		var projectJson = {
			id: project.id,
			name: project.name,
			createdate: project.createdate,
			lastdate: project.lastdate,
			creator: project.creator
		};

		var filename = path.join(process.cwd(), "data", "export", getDirName(), "project.json");

		fs.writeFile(filename, JSON.stringify(projectJson),  function(err) {
			if (err) {
				return reject(err);
			}

			return resolve();
		});
	});

}


/**
 * Save project data to JSON file.
 *
 */
function buildProjectJson() {

	return new Promise(function(resolve, reject) {

		var filename = path.join(process.cwd(), "data", "export", getDirName(), "project-data.json");

		fs.writeFile(filename, JSON.stringify(project.json),  function(err) {
			if (err) {
				return reject(err);
			}

			return resolve();
		});
	});

}


/**
 * Process layers + objects to find resources that need saving.
 *
 */
function findProjectResources() {

	return new Promise(function(resolve, reject) {

		var data = {
			files: [],
			resources: []
		};

		var projectJson = project.json;
		var layers = projectJson.layers;

		// Get layers and their objects/children.

		for (var li = 0; li < layers.length; li++) {

			var stlayer = layers[li];
			var layerstate = stlayer.startstate;
			var children = stlayer.children;

			var playimgs = projectHelper.findLayerImages(children);
			for (var imn = 0; imn < playimgs.length; imn++) {
				var imgobj = playimgs[imn];
				data.files.push(imgobj.path);
			}

			//if the objects are audio objects we need to package the audio resources
			var playsnds = projectHelper.findLayerAudio(children);
			for (var imn = 0; imn < playsnds.length; imn++) {
				var sndobj = playsnds[imn];
				data.files.push(sndobj.src);
			}

		}

		// Remove duplicates
		data.files = data.files.filter(function(elem, pos) {
			return data.files.indexOf(elem) == pos;
		});

		// Skip looking for resources if we have no files
		if (data.files.length === 0) {
			return resolve(data);
		}

		var db = database.getDb();
		var sql = "SELECT id, name, type, jsonstate FROM Resources";

		return db.all(sql, function(err, rows) {

			// Get corresponding resources for each file

			if (err || rows.length === 0) {
				return resolve(data);
			}

			var i,
				hasImage,
				hasAudio,
				prop,
				resJson;

			for (i = 0; i < rows.length; i++) {

				resJson = JSON.parse(rows[i].jsonstate);
				prop = null;

				if (rows[i].type == 'Image') {
					prop = 'path';
				} else if (rows[i].type == 'Audio') {
					prop = 'src';
				}

				if (prop !== null && data.files.includes(resJson[prop])) {
					// File matches, include this resource
					data.resources.push(rows[i]);
				}

			}

			return resolve(data);

		});

	});
}


/**
 * Copy any necessary resources and save JSON of resource list.
 *
 */
function saveProjectResources(data) {

	return new Promise(function(resolve, reject) {

		var i,
			file,
			filename,
			srcFile,
			dstFile,
			rows = [],
			resFilename;

		for (i = 0; i < data.files.length; i++) {
			// Copy file
			file = data.files[i];
			filename = file.replace("resources/", "");
			srcFile = path.join(process.cwd(), "data", "resources", filename);
			dstFile = path.join(process.cwd(), "data", "export", getDirName(), "resources", filename);
			helpers.copyFile(srcFile, dstFile);
		}

		resFilename = path.join(process.cwd(), "data", "export", getDirName(), "resources.json");
		return fs.writeFile(resFilename, JSON.stringify(data),  function(err) {
			if (err) {
				return reject(err);
			}
			return resolve();
		});

	});

}


/**
 * Add all necessary files to the zip.
 *
 */
function buildZip() {

	return new Promise(function(resolve, reject) {

		var projectName = helpers.slugify(project.name);
		var zipFilename = "project-" + projectName + ".zip";
		var zipFile = path.join(process.cwd(), "data", "export", zipFilename);

		var output = fs.createWriteStream(zipFile);
		var archive = archiver('zip');

		output.on('close', function() {
			return resolve({
				file: zipFilename,
				bytes: archive.pointer(),
			});
		});

		archive.on('error', function(err){
			return reject(err);
		});

		archive.pipe(output);
		archive.directory(path.join(process.cwd(), "data", "export", getDirName()), false);
		archive.finalize();

	});

}


function cleanup() {
	var dir = path.join(process.cwd(), "data", "export", getDirName());
	rimraf(dir, function(err) {});
}


/**
 * Run export
 *
 */
function exportProject(cb) {
	createDirs()
		.then(function() {
			return buildMetaJson();
		})
		.then(function() {
			return buildProjectJson();
		})
		.then(function() {
			return findProjectResources();
		})
		.then(function(resources) {
			return saveProjectResources(resources);
		})
		.then(function() {
			return buildZip();
		})
		.then(function(zip) {
			cleanup();
			cb(null, {
				success: true,
				zip: zip
			});
		})
		.catch(function(err) {
			console.log(err);
			cb(err, { success: false });
		})
}


module.exports = {
	init: init,
	export: exportProject
};
