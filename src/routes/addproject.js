var qs = require("querystring"),
	bodyParser = require("body-parser"),
	projectHelper = require("../includes/projectHelper.js"),
	database = require("../includes/database.js"),
	eventLog = require("../includes/event-log"),
	eventType = require("../includes/event-types");

exports.method = "post";
exports.route = "/addproject";

var handlers = [];

handlers.push(function(req, res, next) {

	var decodedBody = req.body;
	var pid = decodedBody.id;
	var pname = decodedBody.name;
	var pcdate = decodedBody.cdate;
	var pldate = decodedBody.ldate;
	var pcreator = decodedBody.creator;
	var pstate = decodedBody.state;

	/*  	  var pid = (url.parse(req.url,true)).query.id;
	var pname = (url.parse(req.url,true)).query.name;
	var pcdate = (url.parse(req.url,true)).query.cdate;
	var pldate = (url.parse(req.url,true)).query.ldate;
	var pcreator = (url.parse(req.url,true)).query.creator;
	var pstate = (url.parse(req.url,true)).query.state;
	*/
	var insid = 0;
	// var db = new sqlite3.Database(dbfile);
	var db = database.getDb();
	//check if project exists
	var sql = "SELECT name,createdate,lastdate,creator,json FROM Projects WHERE id = $id";
	var params = { $id: pid };

	db.each(sql, params, function (error, row) {
		// console.log(row.name);
	}, function(err, rows) {

		if (rows > 0) {

			sql = "UPDATE Projects SET name = $name, createdate = $createdate, lastdate = $lastdate, creator = $creator, json = $state WHERE id = $id";

			params = {
				$name: pname,
				$createdate: pcdate,
				$lastdate: pldate,
				$creator: pcreator,
				$state: pstate,
				$id: pid
			};

			db.run(sql, params, function(error) {

				if (error) {
					return res.status(500).send({ reason: error });
				}

				insid = pid;

				projectHelper.createPlayerEntry({
					name: pname,
					id: pid
				}, function(err, data) {
					//
				});

				eventLog.log({
					"type": eventType.UPDATE_PROJECT,
					"req": req,
					"data": { project_id: pid, project_name: pname }
				});

				res.send(insid.toString());
			});

		} else {

			sql = "INSERT INTO Projects (name, createdate, lastdate, creator, json) VALUES ($name, $createdate, $lastdate, $creator, $state)";

			params = {
				$name: pname,
				$createdate: pcdate,
				$lastdate: pldate,
				$creator: pcreator,
				$state: pstate
			};

			db.run(sql, params, function(error) {

				if (error) {
					return res.status(500).send({ reason: error });
				}

				db.each("SELECT last_insert_rowid() AS id FROM Projects", function(err, row) {
					insid = row.id;
				}, function(err, rows) {

					projectHelper.createPlayerEntry({
						name: pname,
						id: insid
					}, function(err, data) {
						//
					});

					eventLog.log({
						"type": eventType.ADD_PROJECT,
						"req": req,
						"data": { project_id: insid, project_name: pname }
					});

					res.send(insid.toString());
				});

			});
		}

	});

});

exports.handler = handlers;
