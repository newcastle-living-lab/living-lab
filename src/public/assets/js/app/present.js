"use strict";

var $ = require("jquery"),
	Mn = require("backbone.marionette"),
	Radio = require("backbone.radio"),
	config = require("../config/present"),
	Comms = require("../components/present_comms"),
	Store = require("../components/present_store"),
	PresentAppView = require("../views/present_app_view");


/**
 * Actions. Marionette Object classes whose purpose is to listen for events on the "dispatch" channel and deal with them accordingly.
 * This means there is a single place where an event is handled.
 * Each action responded to *may* trigger other events.
 *
 */
var Actions = [
	require("../actions/app_start"),
	require("../actions/io_updates"),
	require("../actions/store"),
	require("../actions/views"),
	require("../actions/groups"),
	require("../actions/events"),
];


var PresentApp = Mn.Application.extend({

	region: '[data-region=app]',

	_comms: null,
	_store: null,
	_dispatchChannel: null,


	initialize: function() {

		// this._appChannel = Radio.channel("app");
		this._dispatchChannel = Radio.channel("dispatch");

		if (config.use_io) {
			var server_url = "http://" + window.location.hostname + ":" + window.location.port;
			this._comms = new Comms({ url: server_url });
		}

		this._store = new Store();

		this.registerActions();
	},


	/**
	 * Loop through the included action classes and initialize them.
	 * the initialize() function in each action will register the Radio channel replies.
	 *
	 */
	registerActions: function() {
		var self = this;
		_.forEach(Actions, function(actionHandler) {
			new actionHandler();
		});
	},


	/**
	 * Dispatch the start event and render the view when it starts
	 *
	 */
	onStart: function() {
		this._dispatchChannel.request("app:start");
		this.showView(new PresentAppView({ store: this._store }));
	}


});


$(document).ready(function() {
	var app = new PresentApp();
	app.start();
});