var fs = require("fs");

exports.method = "get";
exports.route = "/getplaylists";

exports.handler = function(req, res) {

	var baseDir = fs.realpathSync(__dirname + "/../data/playlists/");

	fs.readdir(baseDir, function(error, files) {
		res.send(files);
	});

};
