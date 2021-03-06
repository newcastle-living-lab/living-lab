var path = require("path"),
	fs = require("fs"),
	formidable = require('formidable');

exports.method = "post";
exports.route = "/uploadresource";

exports.handler = function (req, res) {

	var currentPath = '';
	var form = new formidable.IncomingForm();

	form.uploadDir = fs.realpathSync(path.join(process.cwd(), "data"));
	form.keepExtensions = true;
	form.parse(req);

	form.on('field', function(name, value) {
		if (name == 'path') {
			currentPath = value;
		}
	});

	form.on('file', function(name, file) {
		var baseDir = fs.realpathSync(path.join(process.cwd(), "data", "resources", currentPath));
		var newfname = path.join(baseDir, file.name);
		fs.rename(file.path, newfname , function (err) {
			if ( err ) { console.log('ERROR: ' + err); }
		});
	});

	form.on('progress', function(bytesReceived, bytesExpected) {
		var p = (bytesReceived/bytesExpected) * 100;
		res.write("Uploading " + parseInt(p)+ " %\n");

	});

	form.on('end', function() {
		res.end("File Upload Complete");
	});

}
