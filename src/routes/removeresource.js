var auth = require("../includes/auth.js"),
	path = require("path"),
	fs = require('fs');

exports.method = "post";
exports.route = "/removeresource";

exports.handler = [auth.ensureLoggedIn(), auth.ensureRole("edit"), function(req, res) {

	var decodedBody = req.body,
		filename = decodedBody.filename;

	console.log("Removing file resources/" + filename);

	if (filename.length === 0) {
		res.status(500);
		return res.send({ 'error': 'No filename' });
	}

	var filepath = fs.realpathSync(path.join(process.cwd(), "data", "resources", filename));

	fs.unlink(filepath, function(err) {
		if (err) {
			res.status(500);
			return res.send({ 'error': 'Could not delete file.' });
		} else {
			return res.send({ 'status': 'ok' });
		}
	});

}];
