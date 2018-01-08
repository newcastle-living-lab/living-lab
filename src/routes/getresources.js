var fs = require("fs"),
	path = require("path"),
	database = require("../includes/database.js");

exports.method = "get";
exports.route = "/getresources";

exports.handler = function(req, res) {

	var resp = new Array();
	var baseDir = fs.realpathSync(__dirname + "/../data/resources/");

	fs.readdir(baseDir, function(error, files) {
		jsonresp = JSON.stringify(files);
		//console.log(jsonresp);
		res.end(jsonresp);
	});

};
