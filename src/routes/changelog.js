var fs = require("fs"),
	showdown = require('showdown');

exports.method = "get";
exports.route = "/changelog";

exports.handler = function(req, res) {

	var changesFile = __dirname + "/../CHANGES.md";

	fs.readFile(changesFile, "utf-8", function(err, data) {

		if (err) {
			return res.status(404).render("_error.html", { message: err.message });
		}

		var converter = new showdown.Converter(),
			html = converter.makeHtml(data);

		return res.render("changes.html", {
			html: html
		});

	});

}
