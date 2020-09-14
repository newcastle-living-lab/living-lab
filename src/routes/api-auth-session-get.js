
exports.method = "get";
exports.route = "/api/auth/session";

exports.handler = function(req, res) {

	if (req.user) {
		return res.send({
			'success': true,
			'user': req.user
		});
	}

	return res.status(401).send({
		'success': false,
		'reason': 'not_logged_in',
	});

};
