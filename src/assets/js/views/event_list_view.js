"use strict";

var Mn = require("backbone.marionette"),
	$ = require("jquery"),
	Radio = require("backbone.radio"),
	EventItemView = require("./event_item_view");


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
	// reorderOnSort: true,

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

	/**
	 * Ensure that only the events for the group that this list is part of is rendered
	 *
	 */
	filter: function(model, index, collection) {
		return (model.get("group") == this.group.get("name"));
	},

	/**
	 * Return the number of children that match the filter.
	 * Minus 1 for the "header" child view
	 *
	 */
	getChildViewCount: function() {
		return this.children.length;
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