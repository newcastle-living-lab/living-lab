var fs = require("fs"),
	path = require("path");

exports.method = "get";
exports.route = "/getresources";

exports.handler = function(req, res) {

	var baseDir = fs.realpathSync(path.join(process.cwd(), "data", "resources"));

	fs.readdir(baseDir, function(error, files) {

		var allFiles = files.filter(function(file) {
			return file !== ".gitkeep";
		});

		res.send(allFiles);
	});

};
