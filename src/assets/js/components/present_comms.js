var Mn = require('backbone.marionette'),
	Radio = require("backbone.radio");

var Comms = Mn.Object.extend({

	socket: null,
	app_channel: null,

	initialize: function(options) {

		var self = this;

		this.app_channel = Radio.channel("app");

		this.socket = io(options.url);
		this.socket.on('designmsg', function(respdata) {
			//console.log(respdata);
			self.ioUpdate(respdata);
		});

	},

	ioUpdate: function(respdata) {

		var self = this;

		console.log(respdata);
		var viewcommand = JSON.parse(respdata);
		var command = viewcommand.command;

		//console.log(command);
		switch (command) {

			case 'designready':

				var msg = viewcommand.info;
				var project = (viewcommand.project ? viewcommand.project : null);

				if (msg == 'openready') {

					self.app_channel.trigger("designready", {
						project: viewcommand.project,
						status: msg
					});

					// designready = true;
					// $('#createpebutton').prop('disabled', false);
					// $('#createviewbutton').prop('disabled', false);
					self.txPEventsGetPEInfo();

				} else if (msg == 'newready') {

					self.app_channel.trigger("designready", {
						project: project,
						status: msg
					});

					// designready = true;
					// $('#createpebutton').prop('disabled', false);
					// $('#createviewbutton').prop('disabled', false);
					makeStartEvent([]);
					txPEventsGetLayerInfo();

				} else {

					// designready = false;
					self.app_channel.trigger("designready", {
						project: null,
						status: null
					});

					// alert('Designscreen is not ready');

				}
			break;

			case 'layerinfo':
				layers = [{
					layerid: 'none',
					layername: 'none'
				}];
				Array.prototype.push.apply(layers, viewcommand.info);
				console.log(layers);
				// updatePEpropDisp();
			break;

			case 'peinfo':
				var peinfo = viewcommand.info;
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
		this.socket.emit('updateEvents', msg);
	},

	txPEventsGetPEInfo: function() {
		var msg = JSON.stringify({
			command: 'getPEinfo',
			info: ''
		});
		this.socket.emit('updateEvents', msg);
	},

	txPEventsGetLayerInfo: function() {
		var msg = JSON.stringify({
			command: 'getLayerinfo',
			info: ''
		});
		this.socket.emit('updateEvents', msg);
	}

});

module.exports = Comms;