var auth = require("../includes/auth.js");

exports.method = "get";
exports.route = "/playlist";

exports.handler = [auth.ensureLoggedIn(), auth.ensureRole("view"), function(req, res) {
	res.render('playlist.html');
}];
