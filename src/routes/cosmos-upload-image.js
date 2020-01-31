var path = require("path"),
	fs = require("fs"),
	formidable = require('formidable'),
	Jimp = require('jimp');

exports.method = "post";
exports.route = "/cosmos/upload-image";

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
		var newFilepath = path.join(baseDir, newFilename);
		var newThumbpath = path.join(baseDir, 'thumb', newFilename)

		var processImg = Jimp.read(file.path)
			.then(function(img) {
				img.cover(400, 400).write(newThumbpath);
				return img;
			})
			.then(function(img) {
				return fs.rename(file.path, newFilepath , function (err) {
					if ( err ) { console.log('ERROR: ' + err); return false; }
					return true;
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
