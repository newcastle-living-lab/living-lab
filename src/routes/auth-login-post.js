var passport = require("passport"),
	eventLog = require("../includes/event-log"),
	eventType = require("../includes/event-types");

exports.method = "post";
exports.route = "/login";

var handlers = [];

handlers.push(function(req, res, next) {
	if (req.body && req.body.username) {
		req.session.username = req.body.username;
	}
	next();
});

handlers.push(function(req, res, next) {
	passport.authenticate("local", function(err, user, info, status) {

		req.session.messages = req.session.messages || [];
		if (err) { return next(err) }

		if (!user) {
			req.session.messages.push("Incorrect username/password");
			return res.redirect('/login');
		}

		req.logIn(user, {}, function(err) {

			eventLog.log({
				"type": eventType.LOG_IN,
				"req": req,
				"user": user
			});

			if (req.body.ref && req.body.ref.length) {
				return res.redirect(req.body.ref);
			}

			return res.redirect('/');
		});


	})(req, res, next);
});

/*handlers.push(passport.authenticate('local', {
	successRedirect: '/',
	failureRedirect: '/login',
	failureMessage: "Incorrect username/password",
}));*/

exports.handler = handlers;
