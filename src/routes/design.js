var auth = require("../includes/auth.js");

exports.method = "get";
exports.route = "/design";

exports.handler = [auth.ensureLoggedIn(), auth.ensureRole("edit"), function(req, res) {
	res.render('design.html');
}];
