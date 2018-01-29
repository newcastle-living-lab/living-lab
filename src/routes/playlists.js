var fs = require("fs"),
	auth = require("../includes/auth.js");

exports.method = "get";
exports.route = "/playlist";

exports.handler = [auth.ensureLoggedIn(), auth.ensureRole("view"), function(req, res) {

	var baseDir = fs.realpathSync(__dirname + "/../data/playlists/");

	fs.readdir(baseDir, function(error, files) {

		res.render('playlist.html', {
			playlists: files
		});

	});

}];
