"use strict";

var Mn = require('backbone.marionette'),
	Radio = require("backbone.radio");

module.exports = Mn.Object.extend({

	initialize: function(options) {
		console.log("Action | app_start | initialize");
		this._commsChannel = Radio.channel("comms");
		this._dispatchChannel = Radio.channel("dispatch");
		this._dispatchChannel.reply("app:start", this.handleAppStart, this);
	},

	handleAppStart: function(data) {
		console.log("Action | app_start | handleAppStart()");
		this._commsChannel.request("txPEventsCheckDesign");
	}

});