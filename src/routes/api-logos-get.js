var path = require("path");

exports.method = "get";
exports.route = "/api/logos";

var handlers = [];

handlers.push(function(req, res) {

	var logos = {
		primary: [
			{
				"filename": "pf-logo-cloud.png",
				"title": "Cloud Systems",
				"url": "https://cloud-systems.io/",
			},
		],
		secondary: [],
	};

	const config = require(path.join(process.cwd(), "config", "config.json"));
	const allLogos = require(path.join(process.cwd(), "config", "logos.json"));
	const hasAllowList = (typeof(config.logos) !== 'undefined' && Array.isArray(config.logos) && config.logos.length > 0);

	for (var name in allLogos) {
		const isVisible = ((hasAllowList && config.logos.indexOf(name) !== -1) || !hasAllowList);
		if (isVisible) {
			logos.secondary.push(allLogos[name]);
		}
	}

	return res.send({
		'success': true,
		'logos': logos
	});

});

exports.handler = handlers;
