var auth = require("../includes/auth.js"),
	users = require("../includes/users.js");

exports.method = "delete";
exports.route = "/api/users/:userId";

var handlers = [];

handlers.push(auth.ensureRole("admin"));

handlers.push(function(req, res) {

	const userId = req.params.userId;

	users.deleteUser(userId)
		.then(() => {
			return res.send({
				'success': true,
			});
		})
		.catch(function(err) {
			console.error("API: Users Delete: " + err);
			return res.send({
				'success': false,
				'reason': err.toString(),
			});
		});

});

exports.handler = handlers;
