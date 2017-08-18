var $ = require("jquery"),
	Mn = require("backbone.marionette"),
	Comms = require("../components/present_comms"),
	PresentAppView = require("../views/present_app_view");

var USEIO = true;

var PresentApp = Mn.Application.extend({

	region: '[data-region=app]',
	// server_url: null,
	comms: null,

	initialize: function() {

		if (USEIO) {
			var server_url = "http://" + window.location.hostname + ":" + window.location.port;
			this.comms = new Comms({ url: server_url });
		}

	},

	onStart: function() {
		// this.showView(new View());
		// alert("start");
		console.log("onStart");
		this.comms.txPEventsCheckDesign();
		this.showView(new PresentAppView());
	}

});


$(document).ready(function() {
	var app = new PresentApp();
	app.start();
});