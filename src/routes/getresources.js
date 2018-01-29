var fs = require("fs");

exports.method = "get";
exports.route = "/getresources";

exports.handler = function(req, res) {

	var baseDir = fs.realpathSync(__dirname + "/../data/resources/");

	fs.readdir(baseDir, function(error, files) {
		res.send(files);
	});

};
