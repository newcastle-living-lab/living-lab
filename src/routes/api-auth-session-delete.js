
exports.method = "delete";
exports.route = "/api/auth/session";

exports.handler = function(req, res) {

	req.logout();

	return res.send({
		'success': true,
	});

};
