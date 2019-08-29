var database = require("../includes/database.js");

exports.method = "get";
exports.route = "/getprojects";

exports.handler = function(req, res) {

	var resp = new Array();
	// var db = new sqlite3.Database(dbfile);
	var db = database.getDb();
	var sql = "SELECT id,name,createdate,lastdate,creator,folder FROM Projects";

	db.all(sql, function(err, rows) {
		res.send(rows);
	});

};
