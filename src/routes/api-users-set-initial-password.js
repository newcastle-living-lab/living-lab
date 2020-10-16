var auth = require("../includes/auth.js"),
	users = require("../includes/users.js");

exports.method = "post";
exports.route = "/api/users/set_initial_password/:userId/:token";

exports.handler = function(req, res) {

	const userId = req.params.userId;
	const token = req.params.token;
	const password = req.body.password;

	users.setInitialPassword(userId, token, password)
		.then((user) => {
			return req.logIn(user, {}, function(err) {
				return res.send({
					'success': true,
				});
			});
		})
		.catch((err) => {
			console.error("API: Users Set Initial Password: " + err);
			return res.send({
				'success': false,
				'reason': err,
			});
		});
};
