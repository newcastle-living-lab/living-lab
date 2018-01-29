var url = require("url"),
	database = require("../includes/database.js");

exports.method = "get";
exports.route = "/removeproject";

exports.handler = function (req, res) {

	var pid = (url.parse(req.url,true)).query.id;
	// var db = new sqlite3.Database(dbfile);
	var db = database.getDb();
	var sql = "DELETE FROM Projects WHERE id = ?";
	db.run(sql, [pid], function (error) {
		console.log(error);
		console.log('Deleted project ' + pid);
		// db.close();
		res.end();
	});

};
