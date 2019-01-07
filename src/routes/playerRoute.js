var helpers = require("../includes/helpers"),
	projectHelper = require("../includes/projectHelper");

exports.method = "get";
exports.route = "/player/:projectName/:viewName?";


function loadProject(req, res, next) {

	var projectName = req.params.projectName,
		viewName = req.params.viewName;

	req.project = null;

	if (projectName) {
		projectHelper.loadByName(projectName, function(err, project) {
			req.project = project;
			next();
		});
	} else {
		next();
	}

}


function showError(req, res, next) {
	if ( ! req.project) {
		return res.status(404).send("<h1>Project not found.</h1>");
	}
	next();
}


/**
 * Render a main project page.
 * This will show the list of views as links/buttons to open them in new windows, as well as host the "playlist"
 *
 */
function showProject(req, res, next) {

	// Skip this page if we have a viewName to load
	if (req.params.viewName) {
		return next();
	}

	// Render the player page
	return res.render('player/project.html', {
		project: {
			id: req.project.id,
			name: req.project.name,
			slug: req.params.projectName,
			createdate: req.project.createdate,
			lastdate: req.project.lastdate,
			creator: req.project.creator
		}
	});

}


/**
 * Render a view page
 *
 */
function showView(req, res, next) {
	// Make a namespaced view name player:project:view
	var viewName = "player:" + req.params.projectName + ":" + req.params.viewName;
	return res.render("player/screen.html", {
		viewName: viewName,
		project: req.params.projectName,
	});
}


exports.handler = [ loadProject, showError, showProject, showView ];

