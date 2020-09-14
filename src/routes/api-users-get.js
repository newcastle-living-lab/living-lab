var auth = require("../includes/auth.js"),
	users = require("../includes/users.js");

exports.method = "get";
exports.route = "/api/users/:userId";

var handlers = [];

handlers.push(auth.ensureRole("admin"));

handlers.push(function(req, res) {

	const userId = req.params.userId;

	users.getById(userId)
		.then((user) => {
			delete user.password;
			return res.send({
				'success': true,
				'user': user
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
