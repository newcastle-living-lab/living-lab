var passport = require("passport");

exports.method = "post";
exports.route = "/login";

var handlers = [];

handlers.push(function(req, res, next) {
	if (req.body && req.body.username) {
		req.session.username = req.body.username;
	}
	next();
});

handlers.push(passport.authenticate('local', {
	successRedirect: '/',
	failureRedirect: '/login',
	failureMessage: "Incorrect username/password",
}));

exports.handler = handlers;
