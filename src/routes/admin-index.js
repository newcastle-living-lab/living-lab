var settings = require("../includes/settings.js");

exports.method = "get";
exports.route = "/admin(/*)?";

exports.handler = function(req, res) {

	var enableReg = settings.get('users.enable_registration');

	const params = {
		enableReg: enableReg
	};

	return res.render('admin.html', params);
};
