var projectHelper = require("../includes/projectHelper.js"),
	ProjectExporter = require("../includes/ProjectExporter"),
	eventLog = require("../includes/event-log"),
	eventType = require("../includes/event-types");

exports.method = "post";
exports.route = "/export_project/:projectId";

exports.handler = function(req, res) {

	var projectId = req.params.projectId;

	projectHelper.load(projectId, function(err, project) {

		if (err) {
			return res.status(500).send({ 'success': false, 'error': err });
		}

		ProjectExporter.init(project);

		ProjectExporter.export(function(err, data) {

			if (err) {
				return res.status(500).send({ 'success': false, 'error': err });
			}

			eventLog.log({
				'type': eventType.EXPORT_PROJECT,
				'req': req,
				'data': { project_id: projectId, project_name: project.name }
			});

			res.send(data);

		});

	});

};
