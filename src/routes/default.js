var auth = require("../includes/auth.js");

exports.method = "get";
exports.route = "/";

var handlers = [];

handlers.push(function(req, res, next) {
	if (req.session.username) {
		delete req.session.username;
	}
	next();
});

handlers.push(auth.ensureLoggedIn());

handlers.push(function(req, res) {
	res.render('default.html');
});

exports.handler = handlers;
