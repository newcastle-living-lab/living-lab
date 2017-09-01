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
		Array.prototype.push.apply(store.layers);
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
			items = [];

		if (evlists.length <= 0) {
			return;
		}

		// Add default group
		store.groupCollection.add({ name: "default" });

		// Create views from first entry
		//
		var peviews = evlists[0].peviews;
		// loop through the info and create the view entries
		for (var vi = 0; vi < peviews.length; vi++) {
			items.push(peviews[vi].viewstate);
		}
		store.viewCollection.reset(items);

		// Create the PEs (pei = present event index)
		items = [ store.eventCollection.getStartEvent(seviews) ];

		for (var pei = 0; pei < evlists.length; pei++) {
			items.push(evlists[pei]);
		}
		store.eventCollection.reset(items);

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
			startEvent = {},
			seviews = [],
			eventCollection = this._storeChannel.request("eventCollection");

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

		// Params needed for the comms channel event handler.
		var params = {
			statearr: statearr,
			seviews: startEvent.peviews
		};

		this._commsChannel.request("txPEventsArr", params);
	}


});