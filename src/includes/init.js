var fs = require("fs"),
	path = require("path"),
	database = require("./database.js");


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
}


module.exports = init;
