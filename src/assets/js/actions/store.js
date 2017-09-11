"use strict";

var $ = require("jquery"),
	Mn = require('backbone.marionette'),
	Radio = require("backbone.radio"),
	sortable = require("html5sortable/dist/html.sortable.js");


module.exports = Mn.Object.extend({

	initialize: function(options) {

		// console.log("Action | store | initialize");

		this._commsChannel = Radio.channel("comms");
		this._storeChannel = Radio.channel("store");

		this._dispatchChannel = Radio.channel("dispatch");
		this._dispatchChannel.reply("store:sort", this.handleStoreSort, this);
		this._dispatchChannel.reply("store:play_mode", this.handlePlayMode, this);

		this._eventCollection = this._storeChannel.request("eventCollection");
		this._groupCollection = this._storeChannel.request("groupCollection");
		this._store = this._storeChannel.request("store");
	},


	handleStoreSort: function(data) {

		// console.log("Action | store | handleStoreSort()");

		var groupResult = this._sortGroups();
		if ( ! groupResult) {
			return;
		}

		var eventResult = this._sortEvents();
		if ( ! eventResult) {
			return;
		}

		this._dispatchChannel.request("io:send_events");
	},

	_sortGroups: function() {

		var self = this,
			groupNodes = sortable(".event-group-list", "serialize"),
			modelList = [],
			modelCid = null;

		if (groupNodes.length != 1) {
			console.warn("Sort groups: Not exactly one group list. Cancelling");
			return false;
		}

		// Get first and only grouplist
		groupNodes = groupNodes[0];

		_.each(groupNodes.children, function(el, idx) {
			modelCid = $(el).data("group-model-cid");
			modelList.push(self._groupCollection.remove(modelCid, { silent: true }));
		});

		_.each(modelList, function(groupModel, idx) {
			self._groupCollection.add(groupModel, { at: idx, silent: true });
		});

		self._groupCollection.updateIndexes();

		// console.log("New Order:");
		// console.log(self._groupCollection.pluck("name"));

		return true;
	},

	_sortEvents: function() {

		var self = this,
			eventNodes = sortable(".js-event-list", "serialize"),
			eventModelList = [],
			eventModelCid = null,
			eventModel = null,
			groupModelCid = null,
			groupModel = null;

		if (eventNodes.length == 0) {
			console.warn("Sort events: No event lists");
			return;
		}

		// Iterate through all the sortable event lists.
		// This list seems to be in group order too - which is perfect.
		_.each(eventNodes, function(eventGroup, groupIdx) {

			// eventGroup has "list" and "children"
			// eventGroup.list will be EventListView <ul> and will have the groupModel cid as data attr.

			// Get the group data for the list so we can update the model's "group" property
			groupModelCid = $(eventGroup.list).data("group-model-cid");
			groupModel = self._groupCollection.get(groupModelCid);

			// Loop through the child <li> elements (EventItemView)
			_.each(eventGroup.children, function(eventEl, eventIdx) {
				// Get model via cid (on data attr)
				eventModelCid = $(eventEl).data("event-model-cid");
				// Remove the event from the collection
				eventModel = self._eventCollection.remove(eventModelCid, { silent: true });
				// Update the event's group property
				eventModel.set({ "group": groupModel.get("name") }, { silent: true });
				// Add the model to a temporary array - which holds our new order.
				eventModelList.push(eventModel);
			});
		});

		// Re-add our ordered model list back to the collection.
		_.each(eventModelList, function(eventModelItem, idx) {
			self._eventCollection.add(eventModelItem, { at: idx, silent: true });
		});

		var startEventModel = self._eventCollection.findWhere({ name: "startevent" });
		self._eventCollection.remove(startEventModel);
		startEventModel.set("group", self._groupCollection.first().get("name"));
		self._eventCollection.add(startEventModel, { at: 0 });

		// Ensure "index" properties are updated for all event items
		self._eventCollection.updateIndexes();

		self._eventCollection.each(function(m) {
			// console.log("[" + m.get("group") + "] " + m.get("index") + ": " + m.get("name"));
		});

		return true;
	},


	handlePlayMode: function(data) {
		this._store.setPlayMode(data.playMode);
	}


});