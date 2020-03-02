var database = require("../includes/database.js"),
	slugify = require('slugify');

exports.method = "get";
exports.route = "/cosmos/projects";

exports.handler = function(req, res) {

	var db = database.getDb();
	var sql = "SELECT id, name, slug, created_at, modified_at, created_by, folder FROM cosmos";

	db.all(sql, function(err, rows) {

		var projects = rows.map(function(proj) {
			if (proj.slug == undefined || proj.slug == null || (proj.slug && proj.slug.length === 0)) {
				proj.slug = slugify(proj.name && proj.name.length > 0 ? proj.name : '', {
					replacement: '-',
					lower: false,
					strict: true,
				});
			}

			return proj;
		});

		res.send({
			'success': true,
			'projects': projects,
		});
	});

};
