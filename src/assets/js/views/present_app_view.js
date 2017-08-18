var _ = require("lodash"),
	Mn = require("backbone.marionette"),
	Radio = require("backbone.radio"),
	mainTmpl = require("../templates/present_app_view.html");

var PresentAppView = Mn.View.extend({

	tagName: "div",
	className: "wrapper pure-g",
	template: mainTmpl,

	app_channel: null,

	ui: {
		"project_name": "[data-ui=project_name]"
	},

	initialize: function() {

		var self = this;

		this.app_channel = Radio.channel("app");

		// Update UI when we get project name
		this.listenTo(this.app_channel, "designready", function(data) {
			if (data.status == "openready") {
				self.ui.project_name.text(data.project.name);
			} else if (data.status == "newready") {
				self.ui.project_name.text("(New) " + data.project.name);
			} else {
				self.ui.project_name.text("Design not ready!");
			}

		});

	}

});

module.exports = PresentAppView;
