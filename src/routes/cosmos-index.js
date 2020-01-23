var auth = require("../includes/auth.js");

exports.method = "get";
exports.route = "/cosmos";

exports.handler = function(req, res) {
	if (req.path === '/cosmos') {
		return res.redirect('/cosmos/');
	}

	// (req.user && req.user.roles
	var user = null;
	if (req.user) {
		user = {
			username: req.user.username,
			roles: req.user.roles,
		}
	}

	return res.render('cosmos.html', {
		user: user
	});
};
