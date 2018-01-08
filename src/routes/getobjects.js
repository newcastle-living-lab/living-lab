var url = require("url"),
	database = require("../includes/database.js");

exports.method = "get";
exports.route = "/getobjects";

exports.handler = function(req, res) {

	var filterstr = (url.parse(req.url,true)).query.filter;
	var resp = new Array();
	var db = database.getDb();

	if (filterstr == 'all') {
		var sql = "SELECT id,name,type,jsonstate FROM Resources";
	} else {
		var sql = "SELECT id,name,type,jsonstate FROM Resources WHERE name LIKE '%"+filterstr+"%'";
	}

	db.all(sql, function(err, rows) {
		res.send(rows);
	});

};
