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
	},

	ioUpdate: function(respdata) {

		var self = this;
		var viewcommand = JSON.parse(respdata);
		var command = viewcommand.command;

		switch (command) {

			case 'designready':

				var msg = viewcommand.info;
				var project = (viewcommand.project ? viewcommand.project : null);

				this._dispatchChannel.request("io:designready", {
					project: project,
					status: msg
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
				var statesarr = viewcommand.info;
				updateallPEventActions(statesarr);
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
				sev: data.seviews
			}
		});
		this._socket.emit('updateEvents', msg);
	}

});


module.exports = Comms;