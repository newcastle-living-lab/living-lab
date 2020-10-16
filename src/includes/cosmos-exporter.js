var os = require('os'),
	fs = require('fs'),
	path = require('path'),
	archiver = require('archiver-promise'),
	slugify = require('slugify'),
	findRemoveSync = require('find-remove'),
	_ = require('lodash');

module.exports = CosmosExporter = function(projectRow) {
	this.project = {...projectRow};
	this.zipFile = null;
	this.zipFileName = null;
	this.zipFilePath = null;
	this.cleanup();
}


/**
 * Remove old exported files
 *
 */
CosmosExporter.prototype.cleanup = function() {
	const exportPath = path.join(process.cwd(), "data", "export");
	var result = findRemoveSync(exportPath, {
		age: { seconds: 3600 },
		extensions: '.zip',
		limit: 10
	});
}


/**
 * Initialise the zip package and set filename.
 *
 */
CosmosExporter.prototype.initZip = function() {

	if (this.project.name.length === 0) {
		var baseName = this.project.id + "";
	} else {
		var baseName = slugify(this.project.name);
	}

	const dt = Math.round(new Date() / 1000).toString();

	this.zipFileName = ['cosmos', baseName, dt].join('-') + '.zip';
	this.zipFilePath = path.join(process.cwd(), "data", "export", this.zipFileName);

	this.zipFile = archiver(this.zipFilePath, {
		store: true
	});
}


/**
 * Add the project JSON as a file to the zip.
 *
 */
CosmosExporter.prototype.addProject = function() {
	const str = JSON.stringify(this.project);
	this.zipFile.append(str, { name: 'project.json' });
}


/**
 * Given a project data object, find all files that need to be included in the zip.
 *
 */
CosmosExporter.prototype.findFiles = function(obj) {

	var items = [];

	(function tree(obj, idx) {
		for (var key in obj) {
			if (!obj.hasOwnProperty(key)) continue;
			if (key === 'image' && typeof(obj[key]) === 'string') {
				items.push(obj[key]);
			}
			if (toString.call(obj[key]) == "[object Array]") {
				tree(obj[key]);
			}
			if (toString.call(obj[key]) == "[object Object]") {
				tree(obj[key]);
			}
		}
	})(obj, 0);

	return items;
}


/**
 * Add the files for this project
 *
 */
CosmosExporter.prototype.addFiles = function() {
	const files = this.findFiles(this.project.data);
	files.forEach((filename) => {
		var filepath = path.join(process.cwd(), "data", "images", filename);
		var thumbFilepath = path.join(process.cwd(), "data", "images", "thumb", filename);
		this.zipFile.append(fs.createReadStream(filepath), { name: filename });
		this.zipFile.append(fs.createReadStream(thumbFilepath), { name: filename, prefix: "thumb" });
	});
}


/**
 * Bundle the files+data and return the name & path of the zip file.
 *
 */
CosmosExporter.prototype.export = function() {

	this.initZip();
	this.addProject();
	this.addFiles();

	return this.zipFile.finalize()
		.then(() => ({ name: this.zipFileName, path: this.zipFilePath }));
}
