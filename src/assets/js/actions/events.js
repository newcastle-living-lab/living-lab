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

		this._dispatchChannel.reply("event:add", this.handleAddEvent, this);
		this._dispatchChannel.reply("event:select", this.handleSelectEvent, this);
		this._dispatchChannel.reply("event:change", this.handleChangeEvent, this);
		this._dispatchChannel.reply("event:delete", this.handleDeleteEvent, this);
		// this._dispatchChannel.reply("event:start", this.)
	},


	handleAddEvent: function(data) {

		var eventCollection = this._storeChannel.request("eventCollection");

		var params = {};

		if (data.group) {
			params.group = data.group.get("name");
		}

		var newEvent = eventCollection.createNew(params);

		if (newEvent) {
			eventCollection.updateIndexes();
			// Highlight new event
			this._dispatchChannel.request("event:select", { event: newEvent });
			// Comms update to send data
			this._dispatchChannel.request("io:send_events");
			return;
		}

		this._appChannel.request("ui:error", {
			message: "Unable to create new event."
		});
	},


	/**
	 * Handle the selection of an event.
	 *
	 */
	handleSelectEvent: function(data) {

		console.log("Action | event | handleSelectEvent");

		// Call collection function to select the event.
		// This triggers select/deselect event on each model as appropriate.
		var eventCollection = this._storeChannel.request("eventCollection");
		eventCollection.selectEvent(data.event);

		// Raise UI event on the appchannel so the main view can show the edit view.
		if (data.event !== null) {
			this._appChannel.trigger("event:edit", data);
		}

		// Cast it
		this._dispatchChannel.request("io:cast_event", { event: data.event });
	},


	handleChangeEvent: function(data) {
		// Request a comms sync for data
		this._dispatchChannel.request("io:send_events");
	},


	handleDeleteEvent: function(data) {
		var eventCollection = this._storeChannel.request("eventCollection");
		eventCollection.remove(data.event);
		eventCollection.updateIndexes();
		this._dispatchChannel.request("io:send_events");
	}


});