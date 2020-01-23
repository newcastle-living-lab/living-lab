var auth = require("../includes/auth.js");

exports.method = "get";
exports.route = "/epw";

exports.handler = function(req, res) {
	return res.redirect('/cosmos/');
};
