var database = require("../includes/database.js"),
	eventLog = require("../includes/event-log"),
	auth = require("../includes/auth.js"),
	eventType = require("../includes/event-types");

exports.method = "put";
exports.route = "/cosmos-api/projects/:projectId";

var handlers = [];

// Get project - need to interrogate it for the 'created_by' user
//
handlers.push(function(req, res, next) {

	var projectId = req.params.projectId;

	req.projectId = null;
	req.projectUser = null;

	var db = database.getDb();
	var sql = "SELECT id, created_by FROM cosmos WHERE id = ?";

	db.get(sql, [projectId], function(err, row) {

		if ( ! err && row) {
			req.projectId = row.id;
			req.projectUser = row.created_by;
			return next();
		}

		if ( ! row) {
			return res.status(404).send({
				'success': false,
				'reason': 'Not found',
			});
		}

		return res.status(500).send({
			'success': false,
			'reason': 'Unknown',
		});

	});
});


// Check permission of user
//
handlers.push(function(req, res, next) {

	var require_auth = res.locals.require_auth;

	if ( ! require_auth) {
		// No auth required: continue.
		next();
	}

	var projectUser = req.projectUser;
	var hasRoles = (req.user && req.user.roles && req.user.roles.length > 0);
	var hasMatchingRole = (hasRoles && req.user.roles.indexOf("admin") !== -1);

	if (projectUser === req.user.username || hasMatchingRole) {
		return next();
	}

	return res.status(403).send({
		'success': false,
		'reason': 'Access denied',
		'userIsOwner': (projectUser == req.user.username),
		'userIsAdmin': hasMatchingRole,
	});

});


// Save project data
//
handlers.push(function(req, res, next) {

	var decodedBody = req.body;

	var params = {
		$id: decodedBody.id,
		$name: decodedBody.name,
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
	var sql = "UPDATE `cosmos` SET name = $name, modified_at = $modified_at, data = $data WHERE id = $id";

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

});


exports.handler = handlers;
