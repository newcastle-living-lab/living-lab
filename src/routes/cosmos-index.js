var auth = require("../includes/auth.js");

exports.method = "get";
exports.route = "/cosmos";

exports.handler = function(req, res) {

	if (req.path === '/cosmos') {
		return res.redirect('/cosmos/');
	}

	var config = {
		user: null,
		require_auth: res.locals.require_auth ? true : false,
		version: res.locals.app_version,
	};

	if (req.user) {
		config.user = {
			username: req.user.username,
			roles: req.user.roles,
		}
	}

	return res.render('cosmos.html', {
		config: config
	});
};
