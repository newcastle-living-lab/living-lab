var database = require("../includes/database.js"),
	eventLog = require("../includes/event-log"),
	eventType = require("../includes/event-types"),
	cosmosHelper = require('../includes/cosmos-helper.js');

exports.method = "get";
exports.route = "/cosmos-api/projects/:projectId";

exports.handler = function(req, res) {

	var projectId = req.params.projectId;

	var db = database.getDb();
	var sql = "SELECT id, name, slug, created_at, modified_at, created_by, folder, data, template FROM cosmos WHERE id = ?";

	db.get(sql, [projectId], function(err, row) {

		var proj = {};

		if ( ! err && row) {

			var proj = cosmosHelper.transformProject(row);

			return res.send({
				'success': true,
				'project': proj,
			});
		}

		if ( ! row) {
			return res.status(500).send({
				'success': false,
				'reason': err,
			});
		}

		return res.status(500).send({
			'success': false,
			'reason': 'Unknown',
		});

	});

};
