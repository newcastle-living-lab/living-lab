var _ = require('lodash/core'),
	auth = require("../includes/auth.js"),
	users = require("../includes/users.js");

exports.method = "post";
exports.route = "/api/auth/password";

var handlers = [];

handlers.push(function(req, res) {

	const userId = req.user.id;
	const body = req.body;

	const currentPassword = body.current_password;
	const newPassword = body.new_password;

	if (currentPassword.length === 0 || newPassword.length === 0) {
		return res.send({
			'success': false,
			'reason': 'No password supplied.',
		});
	}

	if (newPassword.length < 8) {
		return res.send({
			'success': false,
			'reason': 'New password must be at least 8 characters.',
		});
	}

	users.authenticate(req.user.email, currentPassword)
		.then((user) => {
			const userData = {
				password: newPassword,
			};
			return users.updateUser(req.user.id, userData);
		})
		.then((user) => {
			return res.send({
				'success': true,
			});
		})
		.catch((err) => {
			return res.send({
				'success': false,
				'reason': 'Current password is incorrect.',
			});
		});

	/*

	users.authenticate()

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
		});*/

});

exports.handler = handlers;
