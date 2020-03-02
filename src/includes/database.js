var fs = require("fs"),
	path = require("path"),
	sqlite3 = require("sqlite3").verbose(),
	_ = require('lodash');

var Database = function() {
	this.dbPath = null;
	this.dbExists = null;
	this.db = null;
}


Database.prototype.init = function() {
	this.dbPath = null;
	this.dbExists = fs.existsSync(this.getPath());
	this.db = new sqlite3.Database(this.getPath());
	this.db.serialize();
	this.createTables();
	this.updateTables();
	this.db.parallelize();
}


Database.prototype.getPath = function() {
	if (this.dbPath == null) {
		var config = require(path.join(process.cwd(), "config", "config.json"));
		this.dbPath = path.join(process.cwd(), config.db_path);
		console.log("Database path: " + this.dbPath);
	}
	return this.dbPath;
}


Database.prototype.getDb = function() {
	return this.db;
}


Database.prototype.createTables = function() {

	this.db.run("CREATE TABLE IF NOT EXISTS Projects (id INTEGER PRIMARY KEY, name TEXT, folder TEXT, createdate TEXT, lastdate TEXT, creator TEXT, json TEXT)", function(err) {
		if (err) {
			console.error('Database Projects error', err);
		}
	});

	this.db.run("CREATE TABLE IF NOT EXISTS Resources (id INTEGER PRIMARY KEY, name TEXT, type TEXT, jsonstate TEXT)", function(err) {
		if (err) {
			console.error('Database Resources error', err);
		}
	});

	this.db.run("CREATE TABLE IF NOT EXISTS `Players` (`project_id` INTEGER, `name` TEXT)", function(err) {
		if (err) {
			console.error('Database Players error', err);
		}
	});

	this.db.run("CREATE TABLE IF NOT EXISTS `events` (id INTEGER PRIMARY KEY, datetime TEXT, user TEXT, type TEXT, ip TEXT, browser TEXT, data TEXT)", function(err) {
		if (err) {
			console.error("Database events creation error");
		}
	});

	this.db.run("ALTER TABLE `eps` RENAME TO `cosmos`", function(err) {});

	this.db.run("CREATE TABLE IF NOT EXISTS `cosmos` (id INTEGER PRIMARY KEY, name TEXT, slug TEXT, folder TEXT, created_at TEXT, modified_at TEXT, created_by TEXT, data TEXT)", function(err) {
		if (err) {
			console.error("Database cosmos creation error");
		}
	});

}


Database.prototype.updateTables = function() {

	var db = this.db;

	// Add 'folder' to projects
	this.tableHasColumn('Projects', 'folder', function(colExists) {
		if ( ! colExists) {
			db.run('ALTER TABLE Projects ADD COLUMN folder TEXT');
			console.log('Added "folder" column to Projects.');
		}
	});

	// Add 'slug' to cosmos
	this.tableHasColumn('cosmos', 'slug', function(colExists) {
		if ( ! colExists) {
			db.run('ALTER TABLE cosmos ADD COLUMN slug TEXT');
			console.log('Added "slug" column to Cosmos.');
		}
	});

}


Database.prototype.tableHasColumn = function(table, column, cb) {

	var sql = 'PRAGMA table_info(' + table + ')';

	this.db.all(sql, function (error, rows) {
		var result = _.some(rows, {'name': column});
		cb(result);
	});

}


Database.prototype.closeDb = function() {
	if (this.db !== null && this.db.open) {
		this.db.close();
		console.log("Database closed.");
	} else {
		console.log("Database was not open");
	}
}


module.exports = (new Database());
