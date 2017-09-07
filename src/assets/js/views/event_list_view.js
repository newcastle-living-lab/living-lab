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
	className: "event-list",
	childView: EventItemView,
	// emptyView: EmptyItemView,
	template: _.noop,
	// reorderOnSort: true,

	childViewEvents: {
		"event:play": "playEvent",
		"event:start": "startEvent",
		"event:select": "selectEvent"
	},

	_appChannel: null,
	_dispatchChannel: null,
	// _storeChannel: null,

	initialize: function(options) {

		var self = this;

		this._appChannel = Radio.channel("app");
		this._dispatchChannel = Radio.channel("dispatch");
		// this._storeChannel = Radio.channel("store");

		// this.groupCollection = this._storeChannel.request("groupCollection");

		this.group = options.group;
		this.listenTo(this.group, "change", function(groupModel) {
			self.$el.attr("data-group-model-cid", groupModel.cid);
		});

	},

	onAttach: function() {

		var self = this;

		self.$el.attr("data-group-model-cid", this.group.cid);

		console.log("EventListView | onAttach");
		console.log(this.group.get("name"));
		console.log(this.el);

		this.sortable = Sortable.create(this.el, {

			group: "events",
			draggable: ".event-item",
			// filter: ".event-item-empty",
			animation: 0,

			onEnd: function(event) {

				// Handle the dropping of event items.
				console.log("EventListView | onEnd");

				// Bug with Sortable:
				// The "to" property of the `event` object is the same as the "from" property.
				// To get where the drop target/destination is - get the parentNode of the item.
				// The parentNode will be the list - which as the cid of the group model.
				// Use this to retrive the group from the collection.
				var par = $(event.item.parentNode),
					newGroupCid = par.data("group-model-cid"),
					groupModel = self.group.collection.get(newGroupCid);

				// Get model cid from the view's element (set in GroupItemView)
				// And then get the model from the collection using the cid.
				var modelCid = $(event.item).data("event-model-cid"),
					model = self.collection.get(modelCid);

				model.set({ "group": groupModel.get("name") });

				// Quietly remove the model and re-insert at the new index.
				self.collection.remove(model, { silent: true });
				self.collection.add(model, { at: event.newIndex, silent: true });
				// Tell the collection to update the "index" property of each groupModel
				self.collection.updateIndexes();
				// Request comms update to send the data with the updated order.
				console.log(self.collection);

				self._dispatchChannel.request("io:send_events");

			}
		});
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