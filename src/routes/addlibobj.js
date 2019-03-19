var url = require("url"),
	database = require("../includes/database.js"),
	eventLog = require("../includes/event-log"),
	eventType = require("../includes/event-types");

exports.method = "get";
exports.route = "/addlibobj";

exports.handler = function(req, res) {

	var rname = (url.parse(req.url,true)).query.name;
	var rtype = (url.parse(req.url,true)).query.type;
	var rstate = (url.parse(req.url,true)).query.jsonstate;
	// console.log(rname,rtype,rstate);

	var db = database.getDb();
	var sql = "INSERT INTO Resources (name, type, jsonstate) VALUES ($name, $type, $state)";

	var params = {
		$name: rname,
		$type: rtype,
		$state: rstate
	};

	db.run(sql, params, function (error) {
		// db.close();

		eventLog.log({
			"type": eventType.ADD_RESOURCE,
			"req": req,
			"data": { name: rname, type: rtype }
		});

		res.end();
	});

};
