var fs = require("fs"),
	path = require("path"),
	dirTree = require("directory-tree");

exports.method = "get";
exports.route = "/getresources";

// var baseDir = fs.realpathSync(path.join(process.cwd(), "data", "resources"));
var baseDir = path.join(process.cwd(), "data", "resources");

var nodes = [];
var tree = null;

var mapFn = function(item) {
	return {
		id: item.id,
		parent: item.parent,
		name: item.name,
		type: item.type,
		path: item.path,
	};
}

var walk = function(node) {

	node.path = node.path.replace(baseDir, '');
	node.path = node.path.replace(/\\/g, '/');

	if (node.path == '') {
		node.id = '/';
		node.parent = null;
	}

	nodes.push(mapFn(node));

	if (node.children) {
		for (var index = 0; index < node.children.length; index++) {
			node.children[index].id = (node.id + '/' + node.children[index].name).replace('//', '/');
			node.children[index].parent = node.id;
			walk(node.children[index]);
		}
	}

}

exports.handler = function(req, res) {

	var options = {
		extensions: /\.(png|jpg|jpeg|gif|bmp|wav|mp3|tiff)$/i,
	};

	tree = null;
	nodes = [];

	tree = dirTree(baseDir, options);
	walk(tree);

	return res.send(nodes);

};
