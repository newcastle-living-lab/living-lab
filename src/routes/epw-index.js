var auth = require("../includes/auth.js");

exports.method = "get";
exports.route = "/epw";

exports.handler = function(req, res) {
	if (req.path === '/epw') {
		return res.redirect('/epw/');
	}
	res.render('epw.html');
};
