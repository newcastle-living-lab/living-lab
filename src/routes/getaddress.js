var helpers = require("../includes/helpers.js");

exports.route = '/getaddress';
exports.method = 'get';

exports.handler = function (req, res) {
	serveraddr = helpers.getIPAddress();
	console.log(serveraddr);
	res.send(serveraddr);
}
