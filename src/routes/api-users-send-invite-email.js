var auth = require("../includes/auth.js"),
	users = require("../includes/users.js");

exports.method = "post";
exports.route = "/api/users/send_invite_email/:userId";

var handlers = [];

handlers.push(auth.ensureRole("admin"));

handlers.push(function(req, res) {

	const userId = req.params.userId;
	var hostname = req.headers.host;

	users.sendInviteEmail(userId, hostname)
		.then(() => {
			return res.send({
				'success': true,
			});
		})
		.catch((err) => {
			console.error("API: Users Send Invite Email: " + err);
			return res.status(500).send({
				'success': false,
				'reason': err.toString(),
			});
		});

});

exports.handler = handlers;
