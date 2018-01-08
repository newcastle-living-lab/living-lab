var database = require("../includes/database.js");

exports.method = "get";
exports.route = "/getproject/:projectId";

exports.handler = function(req, res) {

	var projectId = req.params.projectId;
	var db = database.getDb();

	var sql = "SELECT id,name,createdate,lastdate,creator,json FROM Projects WHERE id = ?";

	db.get(sql, [projectId], function(err, row) {
		var proj = row;
		proj.json = JSON.parse(row.json);
		res.end(JSON.stringify(proj));
	});

};
