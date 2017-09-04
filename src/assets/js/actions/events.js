"use strict";

var Mn = require('backbone.marionette'),
	Radio = require("backbone.radio");

module.exports = Mn.Object.extend({


	initialize: function(options) {

		console.log("Action | events | initialize");

		this._storeChannel = Radio.channel("store");
		this._commsChannel = Radio.channel("comms");
		this._dispatchChannel = Radio.channel("dispatch");
		this._appChannel = Radio.channel("app");

		this._dispatchChannel.reply("event:select", this.handleSelectEvent, this);
		this._dispatchChannel.reply("event:change", this.handleChangeEvent, this);
	},

	handleSelectEvent: function(data) {

		// Call collection function to select the event.
		// This triggers select/deselect event on each model as appropriate.
		var eventCollection = this._storeChannel.request("eventCollection");
		eventCollection.selectEvent(data.event);

		if (data.event !== null) {
			// Raise UI event on the appchannel so the main view can show the edit view.
			this._appChannel.trigger("event:edit", data);
		}
	},


	handleChangeEvent: function(data) {
		// Request a comms sync for data
		this._dispatchChannel.request("io:send_events");
	}


});