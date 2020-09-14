var fs = require("fs"),
	path = require("path"),
	crypto = require("crypto"),
	database = require("./database.js"),
	settings = require("./settings.js");
	mailer = require("./mailer.js");



var makeDirs = function() {

	var baseDir = process.cwd();

	var dirs = [
		path.join(baseDir, "data"),
		path.join(baseDir, "data", "resources"),
		path.join(baseDir, "data", "playlists"),
	];

	for (var d in dirs) {

		fs.mkdir(dirs[d], function(err) {

			if (err) {
				if (err.code != 'EEXIST') {
					console.error(err);
				}
			} else {
				console.info("Created directory `" + dirs[d] + "`");
			}

		});

	}
}


var init = function() {

	makeDirs();
	database.init();
	mailer.init();

	settings.init()
		.then(() => {

			console.log("Initialising settings...");

			var secret = settings.get('users.verify_secret');
			if ( ! secret || secret.length === 0) {
				settings.set('users.verify_secret', crypto.randomBytes(32).toString('hex'), 'string').then(() => {
					console.log("Initialised setting users.verify_secret.");
				});
			}

		});
}


module.exports = init;
