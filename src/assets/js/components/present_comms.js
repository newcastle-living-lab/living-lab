"use strict";

var Mn = require('backbone.marionette'),
	Radio = require("backbone.radio");


var Comms = Mn.Object.extend({

	_socket: null,
	_dataChannel: null,
	_appChannel: null,

	initialize: function(options) {

		var self = this;

		this._dataChannel = Radio.channel("data");
		this._appChannel = Radio.channel("app");
		this._dispatchChannel = Radio.channel("dispatch");
		this._commsChannel = Radio.channel("comms");

		// Init socket.io + listener
		this._socket = io(options.url);
		this._socket.on('designmsg', function(respdata) {
			self.ioUpdate(respdata);
		});

		this._commsChannel.reply("txPEventsCheckDesign", this.txPEventsCheckDesign, this);
		this._commsChannel.reply("txPEventsGetPEInfo", this.txPEventsGetPEInfo, this);
		this._commsChannel.reply("txPEventsGetLayerInfo", this.txPEventsGetLayerInfo, this);
		this._commsChannel.reply("txPEventsArr", this.txPEventsArr, this);
		this._commsChannel.reply("castStartEvent", this.castStartEvent, this);
		this._commsChannel.reply("castPresentEvent", this.castPresentEvent, this);
	},

	ioUpdate: function(respdata) {

		var self = this;
		var viewcommand = JSON.parse(respdata);
		var command = viewcommand.command;

		console.log("Comms | ioUpdate | Command: " + command);

		switch (command) {

			case 'designready':
				this._dispatchChannel.request("io:designready", {
					project: (viewcommand.project ? viewcommand.project : null),
					status: viewcommand.info
				});
			break;

			case 'layerinfo':
				this._dispatchChannel.request("io:layerinfo", {
					layers: viewcommand.info
				});
			break;

			case 'peinfo':
				this._dispatchChannel.request("io:peinfo", {
					peinfo: viewcommand.info
				});
			break;

			case 'updateAllPEventActions':
				this._dispatchChannel.request("io:update_actions", {
					statesarr: viewcommand.info
				});
			break;
		}
	},

	txPEventsCheckDesign: function() {
		var msg = JSON.stringify({
			command: 'checkDesignScreen',
			info: ''
		});
		this._socket.emit('updateEvents', msg);
	},

	txPEventsGetPEInfo: function() {
		var msg = JSON.stringify({
			command: 'getPEinfo',
			info: ''
		});
		this._socket.emit('updateEvents', msg);
	},

	txPEventsGetLayerInfo: function() {
		var msg = JSON.stringify({
			command: 'getLayerinfo',
			info: ''
		});
		this._socket.emit('updateEvents', msg);
	},

	txPEventsArr: function(data) {
		var msg = JSON.stringify({
			command: 'updateEventArr',
			info: {
				pel: data.statearr,
				sev: data.seviews,
				groups: data.grouparr
			}
		});
		this._socket.emit('updateEvents', msg);
	},

	castStartEvent: function(data) {

		var event = data.event,
			startinfo = event.get("peviews");

		var msg = JSON.stringify({
			command: "castStartinfo",
			info: startinfo
		});

		// console.log(msg);

		this._socket.emit("updateEvents", msg);
	},

	castPresentEvent: function(data) {

		var event = data.event,
			castind = event.get("index");

		// This command only sends the index of the event.
		// In terms of the data transferred...
		// our indexes are offset by 1 due to the presence of the startevent in the collection.
		// Just to check - if our item at index 0 is startevent, we need to adjust by -1 to account for this.
		// This ensures that when we send `castPEInfo` with index of 0, it's the first custom/user-defined/non-startevent event.
		var firstEventName = data.event.collection.at(0).get("name");
		if (firstEventName == "startevent") {
			castind = castind - 1;
		}

		var msg = JSON.stringify({
			command: 'castPEinfo',
			info: castind
		});

		// console.log(msg);

		this._socket.emit("updateEvents", msg);
	}

});


module.exports = Comms;