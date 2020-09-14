var auth = require("../includes/auth.js"),
	users = require("../includes/users.js");

exports.method = "put";
exports.route = "/api/users/:userId";

var handlers = [];

handlers.push(auth.ensureRole("admin"));

handlers.push(function(req, res) {

	const userId = req.params.userId;
	const body = req.body;

	users.updateUser(userId, body)
		.then((user) => {
			return res.send({
				'success': true,
			});
		})
		.catch(function(err) {
			console.error("API: Users Update: " + err);
			return res.send({
				'success': false,
				'reason': err.toString(),
			});
		});

});

exports.handler = handlers;
