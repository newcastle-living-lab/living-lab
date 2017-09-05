"use strict";

var Mn = require('backbone.marionette'),
	Radio = require("backbone.radio");

module.exports = Mn.Object.extend({


	initialize: function(options) {

		console.log("Action | io | initialize");

		this._storeChannel = Radio.channel("store");
		this._commsChannel = Radio.channel("comms");
		this._dispatchChannel = Radio.channel("dispatch");

		this._dispatchChannel.reply("io:designready", this.handleDesignReady, this);
		this._dispatchChannel.reply("io:layerinfo", this.handleLayerInfo, this);
		this._dispatchChannel.reply("io:peinfo", this.handlePeInfo, this);
		this._dispatchChannel.reply("io:send_events", this.handleSendEvents, this);
		this._dispatchChannel.reply("io:update_actions", this.handleUpdateActions, this);
	},


	/**
	 * Handle the Socket IO "designready" command.
	 * Will receive the project info here.
	 * Actions will be to update the projectModel and dispatch other actions to get further info.
	 *
	 * @param object data		Keys will be `project` and `status`
	 *
	 */
	handleDesignReady: function(data) {

		console.log("Action | io | handleDesignReady()");

		var project = _.extend({ status: data.status }, data.project);
		var projectModel = this._storeChannel.request("projectModel");

		switch (data.status) {

			case "openready":
				projectModel.set(project);
				this._commsChannel.request("txPEventsGetPEInfo");
			break;

			case "newready":
				projectModel.set(project);
				this._commsChannel.request("txPEventsGetLayerInfo");
			break;

			default:
				projectModel.clear();
			break;
		}
	},


	/**
	 * Handle the Socket IO "layerinfo" command.
	 *
	 * @param object data		Object with a `layers` key, which will be array of layers
	 *
	 */
	handleLayerInfo: function(data) {

		console.log("Action | io | handleLayerInfo()");

		// Get reference to store
		var store = this._storeChannel.request("store");

		// Reset layers to be this default list
		store.layers = [{
			layerid: "none",
			layername: "none"
		}];

		// Add the ones we received from the data
		Array.prototype.push.apply(store.layers, data.layers);
		store.layerCollection.reset(store.layers);
	},


	/**
	 * Handle the Socket IO "peinfo" command.
	 *
	 * @param object data		Object with a `peinfo` key, which will be presentevent info data
	 *
	 */
	handlePeInfo: function(data) {

		console.log("Action | io | handlePeInfo()");

		var store = this._storeChannel.request("store");

		var evlists = data.peinfo.evl,
			seviews = data.peinfo.sev,
			groups = data.peinfo.groups,
			group_arr = [],
			view_arr = [],
			event_arr = [];

		if (evlists.length <= 0) {
			return;
		}

		// Groups
		//
		if (groups === undefined || groups.length == 0) {
			group_arr.push({ index: 0, name: "default" });
		}

		Array.prototype.push.apply(group_arr, groups);
		store.groupCollection.reset(group_arr);


		// Views (create views from first entry)
		//
		var peviews = evlists[0].peviews;
		// loop through the info and create the view entries
		for (var vi = 0; vi < peviews.length; vi++) {
			view_arr.push(peviews[vi].viewstate);
		}
		store.viewCollection.reset(view_arr);


		// Events. Create the PEs
		//
		var firstGroup = store.groupCollection.first();
		event_arr.push(store.eventCollection.getStartEvent(seviews, firstGroup.get("name")));

		//  (pei = present event index)
		for (var pei = 0; pei < evlists.length; pei++) {
			event_arr.push(evlists[pei]);
		}
		store.eventCollection.reset(event_arr);

		// Now that the data has been parsed and the relevant collections set, request the layer info
		this._commsChannel.request("txPEventsGetLayerInfo");
	},


	/**
	 * New version of `txPEventsArr`
	 *
	 * Gather the data then request the comms channel sends the message.
	 *
	 */
	handleSendEvents: function() {

		// Get info from events to create raw array for sending

		var statearr = [],
			grouparr = [],
			startEvent = {},
			seviews = [],
			eventCollection = this._storeChannel.request("eventCollection"),
			groupCollection = this._storeChannel.request("groupCollection");

		// Iterate through all the events
		eventCollection.each(function(eventModel) {
			if (eventModel.get("name") == "startevent") {
				// Pick out start event separately (use this to build the views)
				startEvent = eventModel.attributes;
			} else {
				// Otherwise: regular event; just get attrs
				statearr.push(eventModel.attributes);
			}
		});

		// Iterate through the groups.
		// We need to send/store the groups separately as we need both name AND `index` (for sorting)
		groupCollection.each(function(groupModel) {
			grouparr.push(groupModel.attributes);
		});

		// Params needed for the comms channel event handler.
		var params = {
			statearr: statearr,
			seviews: startEvent.peviews,
			grouparr: grouparr
		};

		this._commsChannel.request("txPEventsArr", params);
	},


	/**
	 * Update the actions (in peviews) on each event when they change in the designscreen.
	 *
	 */
	handleUpdateActions: function(data) {

		console.log("Action | io | handleUpdateActions()");

		var statesarr = data.statesarr,
			eventCollection = this._storeChannel.request("eventCollection");

		// Loop through the items we have received
		_.each(statesarr, function(eventArr) {
			// Find the eventModel in the collection using the ID
			var eventModel = eventCollection.get(eventArr.id);
			// Set the peviews array of the eventModel with the new data
			eventModel.set("peviews", eventArr.peviews);
		});
	}


});