var auth = require("../includes/auth.js");

exports.method = "get";
exports.route = "/epw";

exports.handler = function(req, res) {
	if (req.path === '/epw') {
		return res.redirect('/epw/');
	}

	// (req.user && req.user.roles
	var user = null;
	if (req.user) {
		user = {
			username: req.user.username,
			roles: req.user.roles,
		}
	}

	return res.render('epw.html', {
		user: user
	});
};
