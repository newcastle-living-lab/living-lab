"use strict";

var _ = require("lodash"),
	$ = require("jquery"),
	Mn = require("backbone.marionette"),
	Radio = require("backbone.radio"),
	vex = require("vex-js"),
	sortable = require("html5sortable/dist/html.sortable.js"),
	ScreensView = require("./screens_view"),
	GroupListView = require("./group_list_view"),
	ViewEditView = require("./view_edit_view"),
	GroupEditView = require("./group_edit_view"),
	EventEditView = require("./event_edit_view"),
	PresentView = require("./present_view"),
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
		"props": "[data-region=props]",
		"present": "[data-region=present]"
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

	initialize: function() {

		var self = this;

		this._appChannel = Radio.channel("app");
		this._dataChannel = Radio.channel("data");
		this._storeChannel = Radio.channel("store");
		this._dispatchChannel = Radio.channel("dispatch");

		// Get reference to project model so we can update the title.
		this.projectModel = this._storeChannel.request("projectModel");
		this.listenTo(this.projectModel, "change", function(projectModel) {
			self.ui.project_name.text(projectModel.getName());
		});

		// Show error dialogs when they occur
		this._appChannel.reply("ui:error", function(data) {
			var buttons = _.extend({}, vex.dialog.buttons);
			buttons.YES.text = "OK";
			vex.dialog.alert({
				buttons: [ buttons.YES ],
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

		this.listenTo(this._appChannel, "event:edit", function(data) {
			self.showChildView("props", new EventEditView({
				model: data.event
			}));
		});

		this.listenTo(this._appChannel, "group:confirm_delete", this.confirmDeleteGroup);
		this.listenTo(this._appChannel, "event:confirm_delete", this.confirmDeleteEvent);

		var debounceSortables = _.debounce(this.reloadSortables, 100, { trailing: true });
		this.listenTo(this._appChannel, "ui:reload_sortables", debounceSortables);
	},

	onRender: function() {

		this.showChildView("present", new PresentView());

		this.showChildView("screens", new ScreensView({
			collection: this._storeChannel.request("viewCollection")
		}));

		this.showChildView("groups", new GroupListView({
			collection: this._storeChannel.request("groupCollection")
		}));

		this.reloadSortables();
	},

	reloadSortables: function() {

		// console.log("present_app_view | reloadSortables");

		sortable(".event-group-list", "destroy");
		var groupList = sortable(".event-group-list", {
			items: ".event-group-item",
			placeholderClass: "event-group-item sortable-ghost",
			connectWith: "groups",
		});

		sortable(".js-event-list", "destroy");
		var eventList = sortable(".js-event-list", {
			items: ".event-item",
			connectWith: "events",
			placeholderClass: "event-item sortable-ghost"
		});

	},

	handleGroupsToggle: function(event) {
		var $el = $(event.target),
			action = $el.data("action");

		this._appChannel.trigger("group:active", {
			action: action
		});
	},

	handleAddGroup: function() {
		this._dispatchChannel.request("group:add");
	},

	confirmDeleteGroup: function(data) {

		var self = this;

		var buttons = _.extend({}, vex.dialog.buttons);
		buttons.YES.text = "Yes, delete";
		buttons.NO.text = "Cancel";

		vex.dialog.confirm({
			message: 'Are you sure you want to delete this event group? All events inside it will also be deleted!',
			buttons: [ buttons.YES, buttons.NO ],
			callback: function (value) {
				if (value) {
					self._dispatchChannel.request("group:delete", {
						group: data.group
					});
					// alert("DELETE");
					// data.group.trigger('destroy', data.group);
				}
			}
		});
	},


	confirmDeleteEvent: function(data) {

		var self = this;

		var buttons = _.extend({}, vex.dialog.buttons);
		buttons.YES.text = "Yes, delete";
		buttons.NO.text = "Cancel";

		vex.dialog.confirm({
			message: 'Are you sure you want to delete this event?',
			buttons: [ buttons.YES, buttons.NO ],
			callback: function (value) {
				if (value) {
					self._dispatchChannel.request("event:delete", {
						event: data.event
					});
				}
			}
		});
	}

});

module.exports = PresentAppView;
