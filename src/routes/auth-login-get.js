var passport = require("passport");

exports.method = "get";
exports.route = "/login";

exports.handler = function(req, res) {
	res.render('login.html');
};
