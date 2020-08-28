var database = require("../includes/database.js"),
	eventLog = require("../includes/event-log"),
	eventType = require("../includes/event-types");

exports.method = "post";
exports.route = "/cosmos-api/projects";

exports.handler = function(req, res, next) {

	var require_auth = res.locals.require_auth;
	var username = null;

	if (require_auth) {
		username = req.user.username;
	}

	var decodedBody = req.body;

	var params = {
		$name: decodedBody.name,
		$created_at: decodedBody.created_at,
		$modified_at: decodedBody.modified_at,
		$created_by: username,
		$data: JSON.stringify({}),
	};

	var db = database.getDb();
	var sql = "INSERT INTO `cosmos` (name, created_at, modified_at, created_by, data) VALUES ($name, $created_at, $modified_at, $created_by, $data)";

	db.run(sql, params, function(error) {

		if (error) {
			return res.status(500).send({
				'success': false,
				'reason': error,
			});
		}

		var insid = 0;

		db.each("SELECT last_insert_rowid() AS id FROM `cosmos`", function(err, row) {
			insid = row.id;
		}, function(err, rows) {

			/*eventLog.log({
				"type": eventType.ADD_PROJECT,
				"req": req,
				"data": { project_id: insid, project_name: pname }
			});*/

			res.send({
				'success': true,
				'id': parseInt(insid.toString(), 10),
			});

		});

	});

};
