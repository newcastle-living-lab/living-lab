var auth = require("../includes/auth.js");

exports.method = "get";
exports.route = "/";

exports.handler = [auth.ensureLoggedIn(), function(req, res) {
	res.render('default.html');
}];
