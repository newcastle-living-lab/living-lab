var passport = require("passport");

exports.method = "get";
exports.route = "/login";

exports.handler = function(req, res) {

	res.render('login.html', {
		ref: req.query.ref ? req.query.ref : null,
		messages: req.session.messages,
		username: req.session.username || ""
	});
	req.session.messages = [];
};
