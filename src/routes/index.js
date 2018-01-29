var fs = require("fs"),
	path = require("path");

var routes = [];

fs.readdirSync(__dirname).forEach(function(file) {
	var fullFile = path.join(__dirname, file);
	if (fullFile == __filename) return;

	var route = require(fullFile);
	routes.push(route);
});

module.exports = routes;
