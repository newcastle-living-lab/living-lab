var helpers = require("../includes/helpers"),
	projectHelper = require("../includes/projectHelper");

exports.method = "get";
exports.route = "/player/:projectName.json";


exports.handler = function(req, res) {

	var projectName = req.params.projectName;

	if ( ! projectName) {
		return res.status(500).send({ errors: ["No project"] });
	}

	projectHelper.loadByName(projectName, function(err, project) {

		if ( ! project) {
			return res.status(404).send({ errors: ["Not found"] });
		}

		var playerProject = projectHelper.toPlayer(project);
		return res.json(playerProject);

	});

};

