var helpers = require("../includes/helpers");

exports.method = "get";
exports.route = "/:viewName.html";

exports.handler = function(req, res) {

	var viewName = req.params.viewName;
	var viewHtml = helpers.makeScreen(viewName);
	res.send(viewHtml);

};
