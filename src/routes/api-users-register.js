var settings = require("../includes/settings.js"),
	users = require("../includes/users.js");

exports.method = "post";
exports.route = "/api/users/register";

var handlers = [];

handlers.push(function(req, res) {

	var enableReg = settings.get('users.enable_registration');
	if ( ! enableReg) {
		return res.status(500).send({
			'success': false,
			'reason': 'Registration not enabled.',
		});
	}

	var decodedBody = req.body;

	var user = {
		name: decodedBody.name,
		email: decodedBody.email,
	};

	var hostname = req.headers.host;

	users.register(user, hostname)
		.then(() => {
			return res.send({
				'success': true,
			});
		})
		.catch((err) => {
			console.error("API: Users Register: " + err);
			return res.send({
				'success': false,
				'reason': err.toString(),
			});
		});

});

exports.handler = handlers;
