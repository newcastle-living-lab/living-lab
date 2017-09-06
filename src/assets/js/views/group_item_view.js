"use strict";

var Mn = require("backbone.marionette"),
	Radio = require("backbone.radio"),
	config = require("../config/present"),
	EventListView = require("./event_list_view"),
	mainTmpl = require("../templates/group_item_view.html"),
	headerTmpl = require("../templates/event_header_view.html");


/**
 * ScreenView item
 *
 */
var EventHeaderScreenView = Mn.View.extend({
	tagName: "div",
	template: _.template("<strong><%- name %></strong>"),
	className: function() {
		return "pure-u-1 pure-u-md-1-" + config.max_views;
	},
	modelEvents: {
		"change": "render"
	}
});


/**
 * View area in the EventHeaderView that manages the list of screens
 *
 */
var EventHeaderScreensView = Mn.CollectionView.extend({
	tagName: "div",
	className: "pure-g",
	childView: EventHeaderScreenView,
	template: _.noop()
});


/**
 * Header row for the events list.
 * Adds the view info
 *
 */
var EventHeaderView = Mn.View.extend({

	tagName: "li",
	className: "event-header",
	template: headerTmpl,

	regions: {
		"views": "[data-region=views]"
	},

	initialize: function() {
		var self = this;
		this._storeChannel = Radio.channel("store");
	},

	onRender: function() {
		this.showChildView("views", new EventHeaderScreensView({
			collection: this._storeChannel.request("viewCollection")
		}));
	}

});


var GroupItemView = Mn.View.extend({

	tagName: "li",
	className: "event-group-item",
	template: mainTmpl,

	regions: {
		"header": "[data-region=header]",
		"events": "[data-region=events]"
	},

	ui: {
		"event_count": "[data-ui=event_count]",
		"group_name": "[data-ui=group_name]",
		"btn_edit": "[data-ui=btn_edit]",
		"btn_add_event": "[data-ui=btn_add_event]"
	},

	triggers: {
		"click .event-group-item-header": "group:toggle",
		"click @ui.btn_edit": "group:edit",
		"click @ui.btn_add_event": "event:add"
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

		this.listenTo(this.eventListView, "add:child remove:child", function(a, b) {
			// Hack: We need to introduce a delay.
			// The updateUi function gets the count of the event list view children.
			// When removing children, this function gets called before the children count is updated :(
			setTimeout(function() {
				self.updateUi();
			}, 50);
		});
	},


	onRender: function() {
		this.$el.attr("data-model-cid", this.model.cid);
		this.showChildView("header", new EventHeaderView());
		this.showChildView("events", this.eventListView);
		this.updateUi();
	},

	updateUi: function() {
		this.ui.group_name.text(_.escape(this.model.get("name")));
		this.ui.event_count.text(this.eventListView.children.length);
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