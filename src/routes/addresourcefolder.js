var auth = require("../includes/auth.js"),
	path = require("path"),
	fs = require('fs');

exports.method = "post";
exports.route = "/addresourcefolder";

exports.handler = [auth.ensureLoggedIn(), auth.ensureRole("edit"), function(req, res) {

	var decodedBody = req.body,
		currentPath = decodedBody.path,
		newName = decodedBody.name;

	var folderPath = fs.realpathSync(path.join(process.cwd(), "data", "resources", currentPath));
	folderPath = path.join(folderPath, newName);

	fs.mkdir(folderPath, function(err) {

		if (err) {
			res.status(500);
			return res.send({ 'error': 'Could not create new folder.', 'err': err });
		}

		return res.send({ 'status': 'ok' });

	});

}];
