var database = require("../includes/database.js"),
	eventLog = require("../includes/event-log"),
	eventType = require("../includes/event-types"),
	cosmosHelper = require('../includes/cosmos-helper.js'),
	CosmosExporter = require('../includes/cosmos-exporter.js');

exports.method = "post";
exports.route = "/cosmos-api/export-project/:projectId";

exports.handler = function(req, res, next) {

	var projectId = req.params.projectId;

	var db = database.getDb();
	var sql = "SELECT id, name, slug, created_at, modified_at, created_by, folder, data FROM cosmos WHERE id = ?";

	db.get(sql, [projectId], function(err, row) {

		if ( ! row || err) {
			return res.status(500).send({
				'success': false,
				'reason': err ? err : 'unknown',
			});
		}

		// Transform the row first so that the project data JSON is an object
		const proj = cosmosHelper.transformProject(row);
		// New instance of the exporter
		const exporter = new CosmosExporter(proj);

		exporter.export()
			.then((data) => {
				return res.send({
					'success': true,
					'url': data && data.name ? `/export/${data.name}` : false,
					'filename': (data && data.name ? data.name : false),
				});
			})
			.catch((err) => {
				return res.send({
					'success': false,
					'reason': err,
				});
			});

	});

};
