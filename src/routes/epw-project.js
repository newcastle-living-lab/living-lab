var projectHelper = require("../includes/projectHelper.js"),
	eventLog = require("../includes/event-log"),
	eventType = require("../includes/event-types");

exports.method = "get";
exports.route = "/epw/project/:projectId";

exports.handler = function(req, res) {

	var projectId = req.params.projectId;

	projectHelper.load(projectId, function(err, project) {

		if (err) {
			return res.status(500).send({ "error": err });
		}

		res.send(project);

	});

};
