var url = require("url"),
	qs = require("querystring"),
	fs = require("fs"),
	path = require("path"),
	rimraf = require("rimraf"),
	helpers = require("../includes/helpers"),
	eventLog = require("../includes/event-log"),
	eventType = require("../includes/event-types");

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
		var dir = fs.realpathSync(path.join(process.cwd(), "data", "playlists", playlistName));
	} catch (e) {
		res.send({ "error": "Playlist folder does not exist.", "deleted": false });
		return;
	}

	rimraf(dir, function(err) {
		if ( ! err) {
			eventLog.log({
				"type": eventType.DELETE_PLAYLIST,
				"req": req,
				"data": { name: playlistName }
			});
			res.send({ "error": false, "deleted": true });
		} else {
			res.send({ "error": "Could not remove playlist.", "deleted": false });
		}
	});

};
