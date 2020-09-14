var auth = require("../includes/auth.js"),
	users = require("../includes/users.js");

exports.method = "post";
exports.route = "/api/users/invite";

var handlers = [];

handlers.push(auth.ensureRole("admin"));

handlers.push(function(req, res) {

	var decodedBody = req.body;

	var user = {
		email: decodedBody.email,
		name: decodedBody.name,
		roles: decodedBody.roles,
	};

	var hostname = req.headers.host;

	users.invite(user, hostname)
		.then(() => {
			return res.send({
				'success': true,
			});
		})
		.catch((err) => {
			console.error("API: Users Invite: " + err);
			return res.send({
				'success': false,
				'reason': err.toString(),
			});
		});

});

exports.handler = handlers;
