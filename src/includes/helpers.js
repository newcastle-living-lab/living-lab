/**
 * Living Lab server-side helper functions
 *
 */

var os = require("os"),
	fs = require("fs"),
	path = require("path");


/**
 * Get IP Address that we are running on.
 *
 */
var getIPAddress = function(idx) {

	var addresses = [],
		interfaces = os.networkInterfaces(),
		name,
		ifaces,
		iface;

	for (name in interfaces) {
		if(interfaces.hasOwnProperty(name)){
			ifaces = interfaces[name];
			if(!/(loopback|vmware|internal)/gi.test(name)){
				for (var i = 0; i < ifaces.length; i++) {
					iface = ifaces[i];
					if (iface.family === 'IPv4' &&  !iface.internal && iface.address !== '127.0.0.1') {
						addresses.push(iface.address);
					}
				}
			}
		}
	}

	// if an index is passed only return it.
	if (idx >= 0) {
		return addresses[idx];
	}

	return addresses;
}



var copyFile = function(source, target) {
	return new Promise(function(resolve, reject) {
		var rd = fs.createReadStream(source);
		rd.on('error', reject);
		var wr = fs.createWriteStream(target);
		wr.on('error', reject);
		wr.on('finish', resolve);
		rd.pipe(wr);
	});
}



var writePlayfileandImages = function(fname, htmlstr, imglist) {

	var playlistDir = fs.realpathSync(__dirname + "/../data/playlists/" + fname);
	var resourcesDir = fs.realpathSync(__dirname + "/../data/resources/");

	fs.writeFile(path.join(playlistDir, fname + ".html"), htmlstr,  function(err) {
		if (err) {
			return console.error(err);
		}
	});

	//make image directory
	fs.mkdir(path.join(playlistDir, "images"), function(err) {
		if (err) {
			if (err.code == 'EEXIST') {
				// ignore the error if the folder already exists
				for (var imn=0;imn<imglist.length;imn++) {
					var imgfilename = imglist[imn],
						srcFile = path.jon(resourcesDir, imgfilename),
						dstFile = path.join(playlistDir, "images", imgfilename);
					copyFile(srcFile, dstFile);
				}
		 	} else {
		 		console.log(err); // something else went wrong
		 	}
	 	} else {
	 		// successfully created folder
			for (var imn=0;imn<imglist.length;imn++) {
				var imgfilename = imglist[imn],
					srcFile = path.join(resourcesDir, imgfilename),
					dstFile = path.join(playlistDir, "images", imgfilename);
				copyFile(srcFile, dstFile);
			}
		 }
 	});
}


var makeScreen = function(viewName) {

	var htmlstr = '<!DOCTYPE HTML><html><head>';
	htmlstr = htmlstr + '<meta name="viewport" content="width=device-width, initial-scale=1" />';
	htmlstr = htmlstr + '<script type="text/javascript" src="konva.js"></script>';
	htmlstr = htmlstr + '<script type="text/javascript" src="jquery-2.1.1.min.js"></script>';
	htmlstr = htmlstr + '<script src="/socket.io/socket.io.js"></script>';
	htmlstr = htmlstr + '<script src="llcore.js"></script>';
	htmlstr = htmlstr + '<script src="arrows.js"></script>';
	htmlstr = htmlstr + '<script src="actions.js"></script>';
	htmlstr = htmlstr + '<script src="screen.js"></script>';
	//htmlstr = htmlstr + '<script src="scrmin.js"></script>';
	htmlstr = htmlstr + '<link rel="stylesheet" href="screen.css">';
	htmlstr = htmlstr + '<script type="text/javascript" >';
	htmlstr = htmlstr + 'var socketmessage = "'+viewName+'";'; //name of the screen
	htmlstr = htmlstr + 'window.screen_name = "'+viewName+'";'; //name of the screen
	htmlstr = htmlstr + '</script></head>';
	htmlstr = htmlstr + '<body>';
	// htmlstr = htmlstr + '<h3>This is screen:'+viewName+'</h3>';
	htmlstr = htmlstr + '<div id="container">';
	htmlstr = htmlstr + '</div></body></html>';

	return htmlstr;
}



var userHasRole = function(user, roleName) {
	if ( ! user || ! user.roles || user.roles.length == 0) return false;
	return (user.roles.indexOf(roleName) !== -1);
}



module.exports = {
	getIPAddress: getIPAddress,
	copyFile: copyFile,
	writePlayfileandImages: writePlayfileandImages,
	makeScreen: makeScreen,
	userHasRole: userHasRole
};
