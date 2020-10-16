var auth = require("../includes/auth.js");

exports.method = "get";
exports.route = "/cosmos(/*)?";

exports.handler = function(req, res) {

	var config = {
		user: null,
		require_auth: res.locals.require_auth ? true : false,
		version: res.locals.app_version,
		fathom_site_id: res.locals.fathom_site_id,
		auto_save: res.locals.auto_save ? true : false,
	};

	if (req.user) {
		config.user = req.user;
	}

	return res.render('cosmos.html', {
		main: 'main-2.js',
		config: config
	});
};
