var path = require("path"),
	fs = require("fs"),
	formidable = require('formidable'),
	Jimp = require('jimp');

exports.method = "post";
exports.route = "/cosmos-api/upload-image";

exports.handler = function(req, res) {

	var form = new formidable.IncomingForm();
	form.uploadDir = fs.realpathSync(path.join(process.cwd(), 'data'));
	form.keepExtensions = true;
	form.parse(req);

	var file = null;

	form.on('file', function(name, uploadedFile) {
		file = uploadedFile;
	});

	form.on('end', function() {

		var baseDir = fs.realpathSync(path.join(process.cwd(), 'data', 'images'));
		var newFilename = Date.now() + '-' + file.name;
		newFilename = newFilename.replace(/[^a-zA-Z0-9\.]/g, '_');
		var newFilepath = path.join(baseDir, newFilename);
		var newThumbpath = path.join(baseDir, 'thumb', newFilename)

		var processImg = Jimp.read(file.path)
			.then(function(img) {
				return img.cover(400, 400).write(newThumbpath);
			})
			.then(function(img, resolve) {
				return new Promise(function(resolve, reject) {
					fs.rename(file.path, newFilepath , function (err) {
						if (err) {
							console.log('ERROR: ' + err);
							reject(err);
						}
						resolve();
					});
				});
			})
			.then(function(img) {
				return res.send({
					'success': true,
					'filename': newFilename,
				});
			});

	});

};
