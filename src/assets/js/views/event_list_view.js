"use strict";

var Mn = require("backbone.marionette"),
	$ = require("jquery"),
	Radio = require("backbone.radio"),
	config = require("../config/present"),
	EventItemView = require("./event_item_view"),
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


/**
 * Main list view for all events.
 * Parent view of this should be group item view.
 *
 */
var EventListView = Mn.CollectionView.extend({

	tagName: "ul",
	className: "event-list",
	childView: EventItemView,
	template: _.noop,

	childViewEvents: {
		"event:play": "playEvent",
		"event:start": "startEvent",
		"event:select": "selectEvent"
	},

	_appChannel: null,

	initialize: function(options) {
		this._appChannel = Radio.channel("app");
		this._dispatchChannel = Radio.channel("dispatch");
		this.group = options.group;
	},

	onRender: function() {
		this.addChildView((new EventHeaderView()), 0);
	},

	/**
	 * Ensure that only the events for the group that this list is part of is rendered
	 *
	 */
	filter: function(model, index, collection) {
		return (model.get("group") == this.group.get("name"));
		// return (model.get("name") != "event");
	},

	/**
	 * Return the number of children that match the filter.
	 * Minus 1 for the "header" child view
	 *
	 */
	getChildViewCount: function() {
		return this.children.length - 1;
	},

	startEvent: function(childView) {
		this._dispatchChannel.request("event:start", { event: childView.model });
	},

	playEvent: function(childView) {
		this._dispatchChannel.request("event:play", { event: childView.model });
	},

	selectEvent: function(childView) {
		this._dispatchChannel.request("event:select", { event: childView.model });
	}

});


module.exports = EventListView;