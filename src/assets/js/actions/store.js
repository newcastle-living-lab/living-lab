"use strict";

var Mn = require('backbone.marionette'),
	Radio = require("backbone.radio");

module.exports = Mn.Object.extend({

	initialize: function(options) {
		console.log("Action | store | initialize");
		this._commsChannel = Radio.channel("comms");
		this._storeChannel = Radio.channel("store");
		this._dispatchChannel = Radio.channel("dispatch");
		this._dispatchChannel.reply("store:sort", this.handleStoreSort, this);
	},

	handleStoreSort: function(data) {

		console.log("Action | store | handleStoreSort()");

		var eventCollection = this._storeChannel.request("eventCollection"),
			groupCollection = this._storeChannel.request("groupCollection");

		var groupModels = [];

		if (data && data.groups) {
			console.log("Got groups");
			_.each(data.groups, function(groupCid, idx) {
				console.log("Group " + groupCid + " at index " + idx);
				groupModels.push(groupCollection.get(groupCid));
			});
		} else {
			groupCollection.each(function(groupModel) {
				groupModels.push(groupModel);
			});
		}

		console.log("groupModels");
		console.log(groupModels);

		groupCollection.remove(groupModels, { silent: true });
		_.each(groupModels, function(groupModel, idx) {
			groupCollection.add(groupModel, { at: idx, silent: true });
		});

		groupCollection.updateIndexes();

		console.log(groupCollection.pluck("name"));
	}

});