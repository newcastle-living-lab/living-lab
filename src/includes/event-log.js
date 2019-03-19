
var os = require("os"),
	fs = require("fs"),
	path = require("path"),
	_ = require('lodash/core'),
	database = require("./database"),
	helpers = require("./helpers");


function Eventlog() {};


Eventlog.prototype.init = function() {
	this.db = database.getDb();
}


Eventlog.prototype.log = function(input) {

	if ( ! this.db) {
		this.init();
	}

	var ip = (input.req.headers['x-forwarded-for'] || '').split(',')[0] || input.req.connection.remoteAddress;
	var browser = input.req.headers['user-agent'];

	var user = input.req.user.username;
	if (input.user) {
		user = input.user.username;
	}

	var data = JSON.stringify(input.data ? input.data : {});

	var sql = "INSERT INTO events (datetime, user, type, ip, browser, data) VALUES (datetime('now'), $user, $type, $ip, $browser, $data)";

	var params = {
		$user: user,
		$type: input.type,
		$ip: ip,
		$browser: browser,
		$data: data
	};

	this.db.run(sql, params, function(error) {
		if (error) {
			console.log(error);
		}
	});
}


module.exports = (new Eventlog());
