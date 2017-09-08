"use strict";

var Mn = require("backbone.marionette"),
	$ = require("jquery"),
	Radio = require("backbone.radio"),
	Sortable = require("sortablejs"),
	EventItemView = require("./event_item_view");


var EmptyItemView = Mn.View.extend({
	tagName: "li",
	className: "event-item event-item-empty",
	template: _.template("<p class='text-centre'>No events yet! Drag events here from other groups or click Add Event button above.</p>"),
});


/**
 * Main list view for all events.
 * Parent view of this should be group item view.
 *
 */
var EventListView = Mn.CollectionView.extend({

	tagName: "ul",
	className: "event-list js-event-list",
	childView: EventItemView,
	template: _.noop,

	childViewEvents: {
		"event:play": "playEvent",
		"event:start": "startEvent",
		"event:select": "selectEvent",
		"attach": "onChildAttach"
	},

	_appChannel: null,
	_dispatchChannel: null,
	// _storeChannel: null,

	initialize: function(options) {

		var self = this;

		this._appChannel = Radio.channel("app");
		this._dispatchChannel = Radio.channel("dispatch");

		this.group = options.group;
		this.listenTo(this.group, "change", function(groupModel) {
			// console.log("EventListView | group change");
			self.$el.attr("data-group-model-cid", groupModel.cid);
		});

		this.$el.on("sortupdate", function(e) {
			var groupCid = $(e.detail.endparent).data("group-model-cid"),
				thisGroupCid = self.group.cid;

			if (groupCid == thisGroupCid) {
				self._dispatchChannel.request("store:sort", {
					list: "events",
					sortable: e.detail
				});
			}
		});
	},

	onDomRefresh: function() {
		// console.log("EventListView | onDomRefresh");
		this._appChannel.trigger("ui:reload_sortables");
	},

	onChildAttach: function() {
		// console.log("EventListView | onChildAttach");
		if (this.isAttached() && this.isRendered()) {
			this._appChannel.trigger("ui:reload_sortables");
		}
	},

	onRender: function() {
		// console.log("EventListView onRender");
		this.$el.attr("data-group-model-cid", this.group.cid);
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