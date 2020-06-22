var auth = require("../includes/auth.js");

exports.method = "get";
exports.route = "/cosmos(/*)?";

exports.handler = function(req, res) {

	var config = {
		user: null,
		require_auth: res.locals.require_auth ? true : false,
		version: res.locals.app_version,
		fathom_site_id: res.locals.fathom_site_id,
	};

	if (req.user) {
		config.user = {
			username: req.user.username,
			roles: req.user.roles,
		}
	}

	return res.render('cosmos.html', {
		main: 'main-2.js',
		config: config
	});
};
