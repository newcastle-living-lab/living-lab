var passport = require("passport");

exports.method = "post";
exports.route = "/login";

exports.handler = passport.authenticate('local', {
	successRedirect: '/',
	failureRedirect: '/login'
});
