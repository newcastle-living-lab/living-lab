var qs = require("querystring"),
	database = require("../includes/database.js");

exports.method = "post";
exports.route = "/addproject";

exports.handler = function (req, res) {

	var body = '';

	req.on('data', function (data) {
		body += data;
		// console.log("Partial body: " + body);
	});

	req.on('end', function () {
		var decodedBody = qs.parse(body);
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
		var sql = "SELECT name,createdate,lastdate,creator,json FROM Projects WHERE id = ?";

		db.each(sql, [pid], function (error, row) {
			//console.log(row.name);
		}, function(err, rows) {

			//console.log(rows);
			if (rows>0) {

				sql = "UPDATE Projects SET name='"+pname+"',createdate='"+pcdate+"',lastdate='"+pldate+"',creator='"+pcreator+"',json='"+pstate+"' WHERE id='"+pid+"'";
				//console.log(sql);
				db.run(sql, function (error) {
					insid = pid;
					// db.close();
					res.end(insid.toString());
				});

			} else {

				sql = "INSERT INTO Projects (name,createdate,lastdate,creator,json) VALUES ('"+pname+"','"+pcdate+"','"+pldate+"','"+pcreator+"','"+pstate+"')";
				db.run(sql, function (error) {

					db.each("SELECT last_insert_rowid() AS id FROM Projects", function(err, row) {
						insid = row.id;
					}, function(err, rows) {
						// db.close();
						res.end(insid.toString());
					});

				});
			}

		});
	});
	//        res.writeHead(200, {'Content-Type': 'text/html'});

};
