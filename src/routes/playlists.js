var fs = require("fs"),
	path = require("path"),
	auth = require("../includes/auth.js"),
	dateFormat = require("dateformat");

exports.method = "get";
exports.route = "/playlist";

exports.handler = [auth.ensureLoggedIn(), auth.ensureRole("view"), function(req, res) {

	var baseDir = fs.realpathSync(path.join(process.cwd(), "data", "playlists"));

	var files = fs.readdirSync(baseDir)
		.map(function(v) {
			var dt = fs.statSync(baseDir + "/" + v).ctime.getTime();
			return {
				name: v,
				created: dt,
				date: dateFormat(dt, "ddd dS mmm yyyy HH:MM")
			};
		})
		.sort(function(a, b) { return b.created - a.created; });

	res.render('playlist.html', {
		playlists: files
	});

}];
