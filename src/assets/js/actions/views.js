"use strict";

var Mn = require('backbone.marionette'),
	Radio = require("backbone.radio");

module.exports = Mn.Object.extend({


	initialize: function(options) {

		console.log("Action | views | initialize");

		this._storeChannel = Radio.channel("store");
		this._commsChannel = Radio.channel("comms");
		this._dispatchChannel = Radio.channel("dispatch");
		this._appChannel = Radio.channel("app");

		this._dispatchChannel.reply("view:add", this.handleAddView, this);
		this._dispatchChannel.reply("view:edit", this.handleEditView, this);
		this._dispatchChannel.reply("view:rename", this.handleRenameView, this);
		this._dispatchChannel.reply("view:delete", this.handleDeleteView, this);
	},


	handleAddView: function(data) {

		var viewCollection = this._storeChannel.request("viewCollection"),
			eventCollection = this._storeChannel.request("eventCollection");

		if ( ! viewCollection.canAddView()) {
			this._appChannel.request("ui:error", {
				message: "Maximum number of views has been reached.",
			});
			return;
		}

		var newView = viewCollection.createNew();

		if (newView) {

			// Tell the event collection to update its events with the new view
			eventCollection.addView(newView);

			// Request a comms sync for data
			this._dispatchChannel.request("io:send_events");

			return;
		}

		this._dispatchChannel.request("ui:error", {
			message: "Unable to create new view"
		});
	},


	handleEditView: function(data) {
		// This one is easy, just raise event on the appchannel so the main view can show it.
		this._appChannel.trigger("view:edit", data);
	},


	handleRenameView: function(data) {

		// Rename the view in all the events
		var eventCollection = this._storeChannel.request("eventCollection");
		eventCollection.renameView(data.oldName, data.newName);

		// Request a comms sync for data
		this._dispatchChannel.request("io:send_events");
	},


	handleDeleteView: function(data) {

		var viewCollection = this._storeChannel.request("viewCollection"),
			eventCollection = this._storeChannel.request("eventCollection");

		// Remove view from the view collection
		viewCollection.remove(data.view);

		// remove the view from all events
		eventCollection.deleteView(data.view);

		// Request a comms sync for data
		this._dispatchChannel.request("io:send_events");
	}


});