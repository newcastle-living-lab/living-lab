var url = require("url"),
	qs = require("querystring"),
	fs = require("fs"),
	path = require("path"),
	rimraf = require("rimraf"),
	helpers = require("../includes/helpers");

exports.method = "post";
exports.route = "/removeplaylist";

exports.handler = function(req, res) {

	var decodedBody = req.body;
	var playlistName = decodedBody.playlist;

	if (playlistName.length === 0) {
		res.send({ "error": "No playlist supplied.", "deleted": false });
		return;
	}

	try {
		var path = fs.realpathSync(path.join(process.cwd(), "data", "playlists", playlistName));
	} catch (e) {
		res.send({ "error": "Playlist folder does not exist.", "deleted": false });
		return;
	}

	rimraf(path, function(err) {
		if ( ! err) {
			res.send({ "error": false, "deleted": true });
		} else {
			res.send({ "error": "Could not remove playlist.", "deleted": false });
		}
	});

};
