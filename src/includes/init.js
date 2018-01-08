var fs = require("fs"),
	database = require("./database.js");


var makeDirs = function() {

	var baseDir = fs.realpathSync(__dirname + "/../") + "/";

	var dirs = [
		baseDir + "data/",
		baseDir + "data/resources/",
		baseDir + "data/playlists/",
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
