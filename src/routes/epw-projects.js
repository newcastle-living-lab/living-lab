var database = require("../includes/database.js");

exports.method = "get";
exports.route = "/epw/projects";

exports.handler = function(req, res) {

	var db = database.getDb();
	var sql = "SELECT id, name, created_at, modified_at, created_by, folder FROM eps";

	db.all(sql, function(err, rows) {
		res.send({
			'success': true,
			'projects': rows,
		});
	});

};
