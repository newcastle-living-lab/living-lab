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

		this._store = this._storeChannel.request("store");

		this._dispatchChannel.reply("event:add", this.handleAddEvent, this);
		this._dispatchChannel.reply("event:select", this.handleSelectEvent, this);
		this._dispatchChannel.reply("event:change", this.handleChangeEvent, this);
		this._dispatchChannel.reply("event:delete", this.handleDeleteEvent, this);
		this._dispatchChannel.reply("event:start", this.handleStartEvent, this);
		this._dispatchChannel.reply("event:play", this.handlePlayEvent, this);
		this._dispatchChannel.reply("event:next", this.handleNextEvent, this);
		this._dispatchChannel.reply("event:prev", this.handlePrevEvent, this);
	},


	handleAddEvent: function(data) {

		console.log("Action | events | handleAddEvent");

		var eventCollection = this._storeChannel.request("eventCollection");

		var params = {};

		if (data.group) {
			params.group = data.group.get("name");
		}

		var newEvent = eventCollection.createNew(params);

		if (newEvent) {
			eventCollection.updateIndexes();
			newEvent.inheritViewLayers();
			// Highlight new event
			this._dispatchChannel.request("event:select", { event: newEvent, isNew: true });
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

		var self = this;

		console.log("Action | events | handleSelectEvent");

		// Call collection function to select the event.
		// This triggers select/deselect event on each model as appropriate.
		var eventCollection = this._storeChannel.request("eventCollection");
		eventCollection.selectEvent(data.event);

		if (data.event !== null) {

			if ( ! this._store.getPlayMode()) {
				// Raise UI event on the appchannel so the main view can show the edit view.
				this._appChannel.trigger("event:edit", data);
			}

			if (data.isNew === undefined || ! data.isNew) {
				// Cast it
				// console.log("Casting");
				this._dispatchChannel.request("io:cast_event", { event: data.event });
			} else {
				// console.log("Not casting");
			}


			// Are we in Play mode?
			if (this._store.getPlayMode() && data.event.get("name") !== "startevent") {
				_.delay(function() {
					self._dispatchChannel.request("io:send_event_play", { event: data.event });
				}, 250);
			}
		}

	},


	handleChangeEvent: function(data) {
		console.log("Action | events | handleChangeEvent");
		// Request a comms sync for data
		this._dispatchChannel.request("io:send_events");
	},


	handleDeleteEvent: function(data) {
		var eventCollection = this._storeChannel.request("eventCollection");
		eventCollection.remove(data.event);
		eventCollection.updateIndexes();
		this._dispatchChannel.request("io:send_events");
	},


	handleStartEvent: function(data) {
		this._dispatchChannel.request("io:send_event_start", { event: data.event });
	},


	handlePlayEvent: function(data) {
		this._dispatchChannel.request("io:send_event_play", { event: data.event });
	},


	handleNextEvent: function() {

		var eventCollection = this._storeChannel.request("eventCollection"),
			indexOfSelected = eventCollection.indexOf(eventCollection.selectedEvent),
			indexOfNext = indexOfSelected+1,
			nextEvent = eventCollection.at(indexOfNext);

		if (nextEvent) {
			this._dispatchChannel.request("event:select", { event: nextEvent });
		}
	},


	handlePrevEvent: function() {

		var eventCollection = this._storeChannel.request("eventCollection"),
			indexOfSelected = eventCollection.indexOf(eventCollection.selectedEvent),
			indexOfNext = indexOfSelected-1,
			prevEvent = eventCollection.at(indexOfNext);

		if (prevEvent) {
			this._dispatchChannel.request("event:select", { event: prevEvent });
		}
	}


});
