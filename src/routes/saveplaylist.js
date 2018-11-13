var url = require("url"),
	qs = require("querystring"),
	fs = require("fs"),
	path = require("path"),
	nunjucks = require("nunjucks"),
	database = require("../includes/database.js"),
	helpers = require("../includes/helpers");

exports.method = "post";
exports.route = "/saveplaylist";

exports.handler = function(req, res) {

	var decodedBody = req.body;
	//console.log("Body: " + body);
	var fname = decodedBody.projectname;
	var playstate = decodedBody.playlist;
	var playobj = JSON.parse(playstate);
	var imglist = playobj.playimages;

	console.log(fname,imglist);
	// 		var imglistobj = JSON.parse(imglist);
	//console.log(playstate);
	//serveraddr = getIPAddress();
	//

	var htmlstr = nunjucks.render('playlist_template.html', {
		playstate: playstate,
		project_name: fname,
	});

	var baseDir = fs.realpathSync(__dirname + "/../data/playlists/");

	fs.mkdir(path.join(baseDir, fname), function(err) {
		if (err) {
			if (err.code == 'EEXIST') {
				// ignore the error if the folder already exists
				helpers.writePlayfileandImages(fname,htmlstr,imglist);
			} else {
				console.log(err); // something else went wrong
			}
		} else {
			// successfully created folder
			helpers.writePlayfileandImages(fname,htmlstr,imglist);
		}
	});

	return res.send("post received");

};
