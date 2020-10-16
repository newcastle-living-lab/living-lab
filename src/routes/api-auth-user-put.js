var _ = require('lodash/core'),
	auth = require("../includes/auth.js"),
	users = require("../includes/users.js");

exports.method = "put";
exports.route = "/api/auth/user";

var handlers = [];

handlers.push(function(req, res) {

	const userId = req.user.id;
	const body = req.body;

	const userData = _.pick(body, ['name', 'email', 'password']);

	users.updateUser(userId, userData)
		.then((user) => {
			return res.send({
				'success': true,
			});
		})
		.catch(function(err) {
			console.error("API: Auth User Update: " + err);
			return res.send({
				'success': false,
				'reason': err.toString(),
			});
		});

});

exports.handler = handlers;
