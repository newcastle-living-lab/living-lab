"use strict";

var Mn = require('backbone.marionette'),
	Radio = require("backbone.radio");

module.exports = Mn.Object.extend({


	initialize: function(options) {

		console.log("Action | groups | initialize");

		this._storeChannel = Radio.channel("store");
		this._commsChannel = Radio.channel("comms");
		this._dispatchChannel = Radio.channel("dispatch");
		this._appChannel = Radio.channel("app");

		this._dispatchChannel.reply("group:add", this.handleAddGroup, this);
		this._dispatchChannel.reply("group:edit", this.handleEditGroup, this);
		this._dispatchChannel.reply("group:rename", this.handleRenameGroup, this);
		this._dispatchChannel.reply("group:delete", this.handleDeleteGroup, this);
	},

	handleAddGroup: function(data) {

		var groupCollection = this._storeChannel.request("groupCollection");

		if ( ! groupCollection.canAddGroup()) {
			this._appChannel.request("ui:error", {
				message: "Maximum number of groups has been reached.",
			});
			return;
		}

		var newGroup = groupCollection.createNew();

		if (newGroup) {
			// Request a comms sync for data
			this._dispatchChannel.request("io:send_events");
			return;
		}

		this._dispatchChannel.request("ui:error", {
			message: "Unable to create new group"
		});
	},

	handleEditGroup: function(data) {
		// This one is easy, just raise event on the appchannel so the main view can show it.
		this._appChannel.trigger("group:edit", data);
	},

	handleRenameGroup: function(data) {

		// Rename the view in all the events
		var eventCollection = this._storeChannel.request("eventCollection");
		eventCollection.renameGroup(data.oldName, data.newName);

		// Request a comms sync for data
		this._dispatchChannel.request("io:send_events");
	},


	handleDeleteGroup: function(data) {

		var groupCollection = this._storeChannel.request("groupCollection"),
			eventCollection = this._storeChannel.request("eventCollection");

		// Remove group from the group collection
		groupCollection.remove(data.group);

		// remove the group from all events @TODO
		// OR delete events
		// eventCollection.deleteGroup(data.group);

		// Request a comms sync for data
		this._dispatchChannel.request("io:send_events");
	}



});