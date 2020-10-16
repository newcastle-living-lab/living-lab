var auth = require("../includes/auth.js"),
	users = require("../includes/users.js");

exports.method = "get";
exports.route = "/api/users";

var handlers = [];

handlers.push(auth.ensureRole("admin"));

handlers.push(function(req, res) {

	users.getAll()
		.then(function(users) {
			return res.send({
				'success': true,
				'users': users
			});
		})
		.catch(function(err) {
			console.error("API: Users: " + err);
			return res.status(500).send({
				'success': false,
				'reason': err,
			});
		});

});

exports.handler = handlers;
