"use strict";

var _ = require("lodash"),
	$ = require("jquery"),
	Mn = require("backbone.marionette"),
	Radio = require("backbone.radio"),
	ScreensView = require("./screens_view"),
	GroupListView = require("./group_list_view"),
	ViewEditView = require("./view_edit_view"),
	GroupEditView = require("./group_edit_view"),
	vex = require('vex-js'),
	mainTmpl = require("../templates/present_app_view.html");

vex.registerPlugin(require('vex-dialog'));
vex.defaultOptions.className = 'vex-theme-livinglab';


var PresentAppView = Mn.View.extend({

	tagName: "div",
	className: "wrapper pure-g",
	template: mainTmpl,

	_appChannel: null,
	_dataChannel: null,
	_storeChannel: null,

	regions: {
		"screens": "[data-region=screens]",
		"groups": "[data-region=groups]",
		"props": "[data-region=props]"
	},

	ui: {
		"project_name": "[data-ui=project_name]",
		"btn_groups_toggle": "[data-ui=btn_groups_toggle]",
		"btn_add_group": "[data-ui=btn_add_group]"
	},

	events: {
		"click @ui.btn_groups_toggle": "handleGroupsToggle",
		"click @ui.btn_add_group": "handleAddGroup"
	},

	initialize: function(options) {

		var self = this;

		this._appChannel = Radio.channel("app");
		this._dataChannel = Radio.channel("data");
		this._storeChannel = Radio.channel("store");

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
			self.showChildView("props", new ViewEditView({
				model: data.view
			}));
		});

		this.listenTo(this._appChannel, "group:edit", function(data) {
			self.showChildView("props", new GroupEditView({
				model: data.group
			}));
		});

		this.listenTo(this._appChannel, "view:delete", this.deleteView);
		this.listenTo(this._appChannel, "group:delete", this.deleteGroup);
	},

	onRender: function() {

		this.showChildView("screens", new ScreensView({
			collection: this._storeChannel.request("viewCollection")
		}));

		this.showChildView("groups", new GroupListView({
			collection: this._storeChannel.request("groupCollection")
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
	},

	deleteGroup: function(data) {
		var buttons = _.extend({}, vex.dialog.buttons);
		buttons.YES.text = "Yes, delete";
		buttons.NO.text = "Cancel";

		vex.dialog.confirm({
			message: 'Are you sure you want to delete this event group? All events inside it will also be deleted!',
			buttons: [ buttons.YES, buttons.NO ],
			callback: function (value) {
				if (value) {
					data.group.trigger('destroy', data.group);
				}
			}
		});
	}

});

module.exports = PresentAppView;
