var projectHelper = require("../includes/projectHelper.js");

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

		res.send(project);

	});

};
