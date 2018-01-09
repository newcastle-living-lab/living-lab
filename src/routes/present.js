var auth = require("../includes/auth.js");

exports.method = "get";
exports.route = "/present";

exports.handler = [auth.ensureLoggedIn(), auth.ensureRole("edit"), function(req, res) {
	res.render('present.html');
}];
