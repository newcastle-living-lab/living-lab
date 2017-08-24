"use strict";

var _ = require("lodash"),
	$ = require("jquery"),
	Mn = require("backbone.marionette"),
	Radio = require("backbone.radio"),
	ScreensView = require("./screens_view"),
	GroupListView = require("./group_list_view"),
	vex = require('vex-js'),
	mainTmpl = require("../templates/present_app_view.html");

vex.registerPlugin(require('vex-dialog'));
vex.defaultOptions.className = 'vex-theme-livinglab';


var PresentAppView = Mn.View.extend({

	tagName: "div",
	className: "wrapper pure-g",
	template: mainTmpl,

	_appChannel: null,
	_store: null,

	regions: {
		"screens": "[data-region=screens]",
		"groups": "[data-region=groups]",
		"props": "[data-region=props]"
	},

	ui: {
		"project_name": "[data-ui=project_name]",
		"btn_groups_toggle": "[data-ui=btn_groups_toggle]",
	},

	events: {
		"click @ui.btn_groups_toggle": "handleGroupsToggle",
		"click @ui.btn_add_group": "handleAddGroup"
	},

	initialize: function(options) {

		console.log("PresentAppView:initialize");

		var self = this;

		this._store = options.store;

		this._appChannel = Radio.channel("app");
		this._dataChannel = Radio.channel("data");

		// Update UI when we get project name
		this.listenTo(this._dataChannel, "designready", function(data) {
			if (data.status == "openready") {
				self.ui.project_name.text(data.project.name);
			} else if (data.status == "newready") {
				self.ui.project_name.text("(New) " + data.project.name);
			} else {
				self.ui.project_name.text("Design not ready!");
			}
		});

		// Show error dialogs when they occur
		this.listenTo(this._appChannel, "ui:error", function(data) {
			vex.dialog.alert({
				contentClassName: "vex-type-error",
				message: "Error: " + data.message
			});
		});

		this.listenTo(this._appChannel, "view:edit", function(data) {
			// self.showChildView("props", new ScreenEditView({
			// 	model: data.view
			// }));
		});
	},

	onRender: function() {

		this.showChildView("screens", new ScreensView({
			collection: this._store.viewCollection
		}));

		this.showChildView("groups", new GroupListView({
			collection: this._store.groupCollection
		}));

	},

	handleGroupsToggle: function(event) {
		var $el = $(event.target),
			action = $el.data("action");

		this._appChannel.trigger("group:active", {
			action: action
		});
	},

	handleAddGroup: function() {
		this._appChannel.trigger("group:add");
	}

});

module.exports = PresentAppView;
