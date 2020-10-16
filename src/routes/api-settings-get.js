var auth = require("../includes/auth.js"),
	settings = require("../includes/settings.js");

exports.method = "get";
exports.route = "/api/settings";

var handlers = [];

var blocklist = [
	/secret/,
];

handlers.push(auth.ensureRole("admin"));

handlers.push(function(req, res) {

	if ( ! Array.isArray(req.query.keys)) {
		return res.status(500).send({
			'success': false,
			'reason': 'Keys must be provided.',
		});
	}

	var allowKeys = [];

	req.query.keys.forEach((key) => {
		blocklist.forEach((regex) => {
			if ( ! regex.test(key)) {
				allowKeys.push(key);
			}
		});
	});

	if (allowKeys.length === 0) {
		return res.send({
			'success': true,
			'settings': []
		});
	}

	const settingsValues = settings.get(allowKeys);

	return res.send({
		'success': true,
		'settings': settingsValues
	});

});

exports.handler = handlers;
