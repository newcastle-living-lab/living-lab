var projectHelper = require("../includes/projectHelper.js"),
	eventLog = require("../includes/event-log"),
	eventType = require("../includes/event-types");

exports.method = "get";
exports.route = "/getproject/:projectId";

exports.handler = function(req, res) {

	var projectId = req.params.projectId;

	projectHelper.load(projectId, function(err, project) {

		projectHelper.createPlayerEntry(project, function(_err, _data) {
			// Don't fail on error
		});

		if (err) {
			return res.status(500).send({ "error": err });
		}

		eventLog.log({
			"type": eventType.OPEN_PROJECT,
			"req": req,
			"data": { project_id: projectId, project_name: project.name }
		});

		res.send(project);

	});

};
