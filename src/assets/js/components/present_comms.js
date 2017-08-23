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

		// Init socket.io + listener
		this._socket = io(options.url);
		this._socket.on('designmsg', function(respdata) {
			self.ioUpdate(respdata);
		});

		// Wait for main app starting
		this.listenTo(this._appChannel, "start", function() {
			// Kick off the first message to get info/check if design is ready
			self.txPEventsCheckDesign();
		});
	},

	ioUpdate: function(respdata) {

		var self = this;

		// console.log("ioUpdate");
		// console.log(respdata);
		var viewcommand = JSON.parse(respdata);
		var command = viewcommand.command;

		//console.log(command);
		switch (command) {

			case 'designready':

				var msg = viewcommand.info;
				var project = (viewcommand.project ? viewcommand.project : null);

				if (msg == 'openready') {

					self._dataChannel.trigger("designready", {
						project: viewcommand.project,
						status: msg
					});

					// designready = true;
					// $('#createpebutton').prop('disabled', false);
					// $('#createviewbutton').prop('disabled', false);
					self.txPEventsGetPEInfo();

				} else if (msg == 'newready') {

					self._dataChannel.trigger("designready", {
						project: project,
						status: msg
					});

					// designready = true;
					// $('#createpebutton').prop('disabled', false);
					// $('#createviewbutton').prop('disabled', false);
					// makeStartEvent([]);

					self.txPEventsGetLayerInfo();

				} else {

					// designready = false;
					self._dataChannel.trigger("designready", {
						project: null,
						status: null
					});

					// alert('Designscreen is not ready');

				}
			break;

			case 'layerinfo':
				self._dataChannel.trigger("layerinfo", {
					layers: viewcommand.info
				});
				/*var layers = [{
					layerid: 'none',
					layername: 'none'
				}];
				Array.prototype.push.apply(layers, viewcommand.info);*/
				// console.log(layers);
				// updatePEpropDisp();
			break;

			case 'peinfo':
				self._dataChannel.trigger("peinfo", {
					peinfo: viewcommand.info
				});
				// var peinfo = viewcommand.info;
				// openingProject = true;
				// createPEandViews(peinfo);
				self.txPEventsGetLayerInfo();
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
	}

});


module.exports = Comms;