var path = require("path"),
	fs = require("fs"),
	formidable = require('formidable'),
	projectHelper = require("../includes/projectHelper.js"),
	ProjectImporter = require("../includes/ProjectImporter"),
	eventLog = require("../includes/event-log"),
	eventType = require("../includes/event-types");

exports.method = "post";
exports.route = "/import_project";

exports.handler = function(req, res) {

	var dir = fs.realpathSync(path.join(process.cwd(), "data", "tmp"));

	var form = new formidable.IncomingForm();
	form.uploadDir = dir;
	form.keepExtensions = true;
	form.parse(req);

	form.on('file', function(name, file) {

		if (file.type !== 'application/x-zip-compressed') {
			return res.status(500).send({ 'success': false, 'error': 'Uploaded file should be a zip file.' });
		}

		ProjectImporter.init(file);
		ProjectImporter.import(function(err, data) {

			if (err) {
				return res.status(500).send({ 'success': false, 'error': err });
			}

			// eventLog.log({
			// 	'type': eventType.IMPORT_PROJECT,
			// 	'req': req,
			// 	'data': { project_id: data.project.id, project_name: data.project.name }
			// });

			res.send(data);

		});

	});

};
