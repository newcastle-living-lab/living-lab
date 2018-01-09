var passport = require("passport");

exports.method = "get";
exports.route = "/logout";

exports.handler = function(req, res) {
	req.logout();
	res.redirect('/');
};
