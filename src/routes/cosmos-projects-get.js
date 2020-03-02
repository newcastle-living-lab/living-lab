var database = require("../includes/database.js"),
	eventLog = require("../includes/event-log"),
	eventType = require("../includes/event-types"),
	slugify = require('slugify');

exports.method = "get";
exports.route = "/cosmos/projects/:projectId";

exports.handler = function(req, res) {

	var projectId = req.params.projectId;

	var db = database.getDb();
	var sql = "SELECT id, name, slug, created_at, modified_at, created_by, folder, data FROM cosmos WHERE id = ?";

	db.get(sql, [projectId], function(err, row) {

		var proj = {};

		if ( ! err && row) {

			proj = row;
			proj.data = JSON.parse(row.data);
			if (proj.slug == undefined || proj.slug == null || (proj.slug && proj.slug.length === 0)) {
				proj.slug = slugify(proj.name && proj.name.length > 0 ? proj.name : '', {
					replacement: '-',
					lower: false,
					strict: true,
				});
			}

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
