var auth = require("../includes/auth.js"),
	users = require("../includes/users.js");

exports.method = "post";
exports.route = "/api/users/check_verify_token/:userId/:token";

exports.handler = function(req, res) {

	const userId = req.params.userId;
	const token = req.params.token;

	users.checkVerifyToken(userId, token)
		.then(({ user, payload }) => {
			return res.send({
				'user': user,
				'success': true,
			});
		})
		.catch((err) => {
			console.error("API: Users Check Verify Token: " + err);
			return res.send({
				'success': false,
				'reason': err.toString(),
			});
		});
};
