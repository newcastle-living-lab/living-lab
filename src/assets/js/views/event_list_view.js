"use strict";

var Mn = require("backbone.marionette"),
	Radio = require("backbone.radio"),
	EventItemView = require("./event_item_view"),
	headerTmpl = require("../templates/event_header_view.html");


var EventHeaderView = Mn.View.extend({
	tagName: "li",
	className: "event-header",
	template: headerTmpl,

	ui: {
		"views": "[data-ui=views]"
	},

	initialize: function() {

	}
});


var EventListView = Mn.CollectionView.extend({

	tagName: "ul",
	className: "event-list",
	childView: EventItemView,
	template: _.noop,

	_appChannel: null,

	initialize: function(options) {
		this._appChannel = Radio.channel("app");
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
	}

});


module.exports = EventListView;