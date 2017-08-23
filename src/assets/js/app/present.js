"use strict";

var $ = require("jquery"),
	Mn = require("backbone.marionette"),
	Radio = require("backbone.radio"),
	config = require("../config/present"),
	Comms = require("../components/present_comms"),
	Store = require("../components/present_store"),
	PresentAppView = require("../views/present_app_view");


var PresentApp = Mn.Application.extend({

	region: '[data-region=app]',

	_comms: null,
	_store: null,
	_appChannel: null,

	initialize: function() {

		this._appChannel = Radio.channel("app");

		if (config.use_io) {
			var server_url = "http://" + window.location.hostname + ":" + window.location.port;
			this._comms = new Comms({ url: server_url });
		}

		this._store = new Store();
	},

	onStart: function() {
		console.log("onStart");
		this._appChannel.trigger("start");
		this.showView(new PresentAppView({ store: this._store }));
		console.log(config);
	}

});


$(document).ready(function() {
	var app = new PresentApp();
	app.start();
});