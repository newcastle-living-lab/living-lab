var url = require("url"),
	qs = require("querystring"),
	fs = require("fs"),
	path = require("path"),
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
	var htmlstr = '<!DOCTYPE HTML><html><head>';
	htmlstr = htmlstr + '<meta name="viewport" content="width=device-width, initial-scale=1" />';
	htmlstr = htmlstr + '<link rel="stylesheet" href="../../playscreen.css">';
	htmlstr = htmlstr + '<script src="../../jquery-2.1.1.min.js"></script>';
	htmlstr = htmlstr + '<script src="../../konva.min.js"></script>';
	htmlstr = htmlstr + '<script src="../../socket.io/socket.io.js"></script>';

	htmlstr = htmlstr + '<script type="text/javascript" >';
	htmlstr = htmlstr + 'peinfo='+playstate+';';
	htmlstr = htmlstr + '</script></head>';
	htmlstr = htmlstr + '<script src="../../playscreen.js"></script>';
	htmlstr = htmlstr + '<body><div id="page">';
	htmlstr = htmlstr + '<div id="functionbox"><input id="playaction" type="checkbox" onchange="setPlaymode()" >play mode<button  type="button" id="nextbutton" onclick="gonextEvent()">next</button></div>';
	htmlstr = htmlstr + '<div id="playspace"></div></div></body></html>';
	htmlstr = htmlstr + '<script> $( document ).ready(setup());</script>';

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
