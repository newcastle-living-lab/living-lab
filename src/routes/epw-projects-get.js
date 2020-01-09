var database = require("../includes/database.js"),
	eventLog = require("../includes/event-log"),
	eventType = require("../includes/event-types");

exports.method = "get";
exports.route = "/epw/projects/:projectId";

exports.handler = function(req, res) {

	var projectId = req.params.projectId;

	var db = database.getDb();
	var sql = "SELECT id, name, created_at, modified_at, created_by, folder, data FROM eps WHERE id = ?";

	db.get(sql, [projectId], function(err, row) {

		var proj = {};

		if ( ! err && row) {

			proj = row;
			proj.data = JSON.parse(row.data);

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
