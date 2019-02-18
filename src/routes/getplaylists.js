var fs = require("fs"),
	path = require("path");

exports.method = "get";
exports.route = "/getplaylists";

exports.handler = function(req, res) {

	var baseDir = fs.realpathSync(path.join(process.cwd(), "data", "playlists"));

	fs.readdir(baseDir, function(error, files) {
		res.send(files);
	});

};
