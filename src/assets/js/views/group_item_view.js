"use strict";

var Mn = require("backbone.marionette"),
	Radio = require("backbone.radio"),
	EventListView = require("./event_list_view"),
	mainTmpl = require("../templates/group_item_view.html");


var GroupItemView = Mn.View.extend({

	tagName: "li",
	className: "event-group-item",
	template: mainTmpl,

	regions: {
		"events": "[data-region=events]"
	},

	ui: {
		"event_count": "[data-ui=event_count]",
		"group_name": "[data-ui=group_name]",
		"btn_edit": "[data-ui=btn_edit]"
	},

	triggers: {
		"click .event-group-item-header": "group:toggle",
		"click @ui.btn_edit": "group:edit"
	},

	modelEvents: {
		"change": "updateUi"
	},

	initialize: function() {

		var self = this;

		this._storeChannel = Radio.channel("store");

		this.eventListView = new EventListView({
			// pass in the whole event collection
			collection: this._storeChannel.request("eventCollection"),
			// pass this group model into the list so it knows how to filter the global event colleciton
			group: this.model
		});

		// Wait for the evenlistview render event and update our event counter UI to match the filtered list
		this.listenTo(this.eventListView, "render", function() {
			self.updateUi();
		});

	},

	onRender: function() {
		this.showChildView("events", this.eventListView);
		this.updateUi();
	},

	updateUi: function() {
		this.ui.group_name.text(_.escape(this.model.get("name")));
		this.ui.event_count.text(this.eventListView.getChildViewCount());
	},

	setActive: function() {
		this.$el.addClass("is-active");
	},

	setInactive: function() {
		this.$el.removeClass("is-active");
	},

	toggleActive: function() {
		this.$el.toggleClass("is-active");
	}

});


module.exports = GroupItemView;