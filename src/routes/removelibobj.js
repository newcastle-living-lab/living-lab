var url = require("url"),
	database = require("../includes/database.js");

exports.method = "get";
exports.route = "/removelibobj";

exports.handler = function(req, res) {

	var rid = (url.parse(req.url, true)).query.id;
	var db = database.getDb();
	var sql = "DELETE FROM Resources WHERE id = ?";

	db.run(sql, [rid], function (error) {
		res.end();
	});

};
