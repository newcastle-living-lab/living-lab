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
		var newThumbpath = path.join(baseDir, 'thumb', newFilename);

		var processImg = Jimp.read(file.path)
			.then(function(img) {
				console.log("JIMP reading image");
				return img.cover(400, 400).write(newThumbpath.toLowerCase());
			})
			.then(function(img) {
				console.log("Moving original file");
				return new Promise(function(resolve, reject) {
					fs.rename(file.path, newFilepath.toLowerCase() , function (err) {
						if (err) {
							console.log('Move error:');
							console.log(err);
							reject(err);
						}
						console.log("Moved!");
						resolve();
					});
				});
			})
			.then(function(img) {
				console.log("Completed image upload.");
				return res.send({
					'success': true,
					'filename': newFilename,
				});
			})
			.catch(function(err) {
				console.log('Caught error');
				console.log(err);
			});

	});

};
