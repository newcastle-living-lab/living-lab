/**
 * Living Lab server-side helper functions
 *
 */

var os = require("os"),
	fs = require("fs"),
	path = require("path"),
	nunjucks = require("nunjucks");


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
						srcFile = path.join(resourcesDir, imgfilename),
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
	return nunjucks.render('screen_template.html', {
		viewName: viewName,
		project: null,
	});
}



var userHasRole = function(user, roleName) {
	if ( ! user || ! user.roles || user.roles.length == 0) return false;
	return (user.roles.indexOf(roleName) !== -1);
}


var slugify = function(text) {
	return text.toString().toLowerCase()
		.replace(/\s+/g, '-')		// Replace spaces with -
		.replace(/[^\w\-]+/g, '')		// Remove all non-word chars
		.replace(/\-\-+/g, '-')		// Replace multiple - with single -
		.replace(/^-+/, '')		// Trim - from start of text
		.replace(/-+$/, '');		// Trim - from end of text
}


module.exports = {
	getIPAddress: getIPAddress,
	copyFile: copyFile,
	writePlayfileandImages: writePlayfileandImages,
	makeScreen: makeScreen,
	userHasRole: userHasRole,
	slugify: slugify,
};
