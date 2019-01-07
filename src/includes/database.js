var fs = require("fs"),
	sqlite3 = require("sqlite3").verbose(),
	config = require("../config/config.json");


var Database = function(params) {

	var baseDir = fs.realpathSync(__dirname + "/../") + "/";

	this.dbPath = baseDir + params.db_path;
	console.log("Database path: " + this.dbPath);
}


Database.prototype.init = function() {
	this.dbExists = fs.existsSync(this.dbPath);
	this.db = null;
	this.createTables();
}


Database.prototype.getDb = function() {
	if (this.db === null || ! this.db.open) {
		this.db = new sqlite3.Database(this.dbPath);
		console.log("Database opened");
	}
	return this.db;
}


Database.prototype.createTables = function() {

	var db = this.getDb();

	db.serialize(function() {

		db.run("CREATE TABLE IF NOT EXISTS Projects (id INTEGER PRIMARY KEY, name TEXT, createdate TEXT, lastdate TEXT, creator TEXT, json TEXT)", function(err) {
			if (err) {
				console.error('Database Projects error', err);
			}
		});

		db.run("CREATE TABLE IF NOT EXISTS Resources (id INTEGER PRIMARY KEY, name TEXT, type TEXT, jsonstate TEXT)", function(err) {
			if (err) {
				console.error('Database Resources error', err);
			}
		});

		db.run("CREATE TABLE IF NOT EXISTS `Players` (`project_id` INTEGER, `name` TEXT)", function(err) {
			if (err) {
				console.error('Database Players error', err);
			}
		});

	});
}


Database.prototype.closeDb = function() {
	if (this.db !== null && this.db.open) {
		this.getDb().close();
		console.log("Database closed.");
	} else {
		console.log("Database was not open");
	}
}


module.exports = (new Database({ db_path: config.db_path }));

/*
var dbfile = "livlab.sqlite";
var dbexists = fs.existsSync(dbfile);
var db = new sqlite3.Database(dbfile);  //create or open if exists

db.serialize(function() {
	console.log(dbexists);
	if ( ! dbexists) {
		db.run("CREATE TABLE Projects (id INTEGER PRIMARY KEY, name TEXT, createdate TEXT, lastdate TEXT, creator TEXT, json TEXT)", function(err) {
			console.log('Projects',err);
		});
		db.run("CREATE TABLE Resources (id INTEGER PRIMARY KEY, name TEXT, type TEXT, jsonstate TEXT)", function(err) {
			console.log('Resources',err);
		});//library table
	}
});

db.close();
*/
