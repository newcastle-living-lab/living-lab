var database = require("../includes/database.js"),
	eventLog = require("../includes/event-log"),
	eventType = require("../includes/event-types");

exports.method = "put";
exports.route = "/cosmos-api/projects/:projectId";

exports.handler = function(req, res, next) {

	var decodedBody = req.body;

	var params = {
		$id: decodedBody.id,
		$name: decodedBody.name,
		$created_by: decodedBody.created_by,
		$template: decodedBody.template ? decodedBody.template : null,
		$modified_at: decodedBody.modified_at,
		$data: JSON.stringify(decodedBody.data),
	};

	if ( ! params.$id) {
		return res.status(500).send({
			'success': false,
			'reason': 'No ID',
		});
	}

	var db = database.getDb();
	var sql = "UPDATE `cosmos` SET name = $name, template = $template, created_by = $created_by, modified_at = $modified_at, data = $data WHERE id = $id";

	db.run(sql, params, function(error) {

		if (error) {
			return res.status(500).send({
				'success': false,
				'reason': error,
			});
		}

		return res.send({
			'success': true,
			'id': parseInt(params.$id.toString(), 10),
		});

	});

};
