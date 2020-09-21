var path = require("path"),
	fs = require("fs"),
	formidable = require('formidable'),
	auth = require("../includes/auth.js"),
	CosmosImporter = require('../includes/cosmos-importer.js');

exports.method = "post";
exports.route = "/cosmos-api/import-project";

var handlers = [];

handlers.push(auth.ensureRole("edit"));

handlers.push(function(req, res) {

	const created_by = req.user && req.user.email ? req.user.email : null;

	var dir = fs.realpathSync(path.join(process.cwd(), "data", "tmp"));

	var form = new formidable.IncomingForm();
	form.uploadDir = dir;
	form.keepExtensions = true;
	form.parse(req);

	form.on('file', function(name, file) {

		var mimeMatch = false;

		switch (file.type) {
			case 'application/zip':
			case 'application/octet-stream':
			case 'application/x-zip-compressed':
			case 'multipart/x-zip':
				mimeMatch = true;
			break;
		}

		if ( ! mimeMatch) {
			return res.status(500).send({
				'success': false,
				'reason': 'Uploaded file should be a zip file, not ' + file.type + '.'
			});
		}

		// New instance of the importer
		const importer = new CosmosImporter({ file, created_by });

		importer.import()
			.then((data) => {
				return res.send({
					'success': true,
					'id': data && data.id ? data.id : false,
				});
			})
			.catch((err) => {
				return res.send({
					'success': false,
					'reason': err.toString(),
				});
			});

	});

});

exports.handler = handlers;
