var auth = require("../includes/auth.js"),
	path = require("path"),
	fs = require('fs');

exports.method = "post";
exports.route = "/removeresource";

exports.handler = [auth.ensureLoggedIn(), auth.ensureRole("edit"), function(req, res) {

	var decodedBody = req.body,
		filename = decodedBody.filename,
		dir = decodedBody.dir;

	if (filename === undefined && dir && dir.length > 0) {

		// Remove dir

		var filepath = fs.realpathSync(path.join(process.cwd(), "data", "resources", dir));
		console.log("Removing dir " + filepath);

		fs.rmdir(filepath, function(err) {
			if (err) {
				res.status(500);
				return res.send({ 'error': 'Could not delete folder.', 'err': err });
			} else {
				return res.send({ 'status': 'ok' });
			}
		});

	} else if (dir === undefined && filename && filename.length > 0) {

		// Remove file
		console.log("Removing file resources/" + filename);

		var filepath = fs.realpathSync(path.join(process.cwd(), "data", "resources", filename));

		fs.unlink(filepath, function(err) {
			if (err) {
				res.status(500);
				return res.send({ 'error': 'Could not delete file.' });
			} else {
				return res.send({ 'status': 'ok' });
			}
		});

	} else {

		res.status(500);
		return res.send({ 'error': 'No filename or directory.' });

	}


}];
