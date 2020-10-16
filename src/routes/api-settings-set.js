var auth = require("../includes/auth.js"),
	settings = require("../includes/settings.js");

exports.method = "put";
exports.route = "/api/settings";

var handlers = [];

var blocklist = [
	/secret/,
];

handlers.push(auth.ensureRole("admin"));

handlers.push(function(req, res) {

	const data = req.body;
	var safeData = {};

	for (const key in data) {
		blocklist.forEach((regex) => {
			if ( ! regex.test(key)) {
				safeData[key] = data[key];
			}
		});
	}

	if (Object.keys(safeData).length === 0) {
		return res.status(500).send({
			'success': false,
			'reason': 'Data must be provided.',
		});
	}

	settings.set(safeData)
		.then(() => {
			return res.send({
				'success': true
			});
		})
		.catch((err) => {
			return res.status(500).send({
				'success': false,
				'reason': err,
			});
		});


});

exports.handler = handlers;
