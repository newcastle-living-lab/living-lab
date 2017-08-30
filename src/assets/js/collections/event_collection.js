"use strict";

var Bb = require("backbone"),
	Radio = require("backbone.radio"),
	Common = require("../components/common"),
	EventModel = require("../models/event_model");


var EventCollection = Bb.Collection.extend({

	model: EventModel,

	_appChannel: null,

	initialize: function() {
		this._appChannel = Radio.channel("app");
		this.listenTo(this._appChannel, "view:added", this.handleAddView);
		this.listenTo(this._appChannel, "view:deleted", this.handleDeleteView);
		this.listenTo(this._appChannel, "view:changed", this.handleChangeView);
	},

	// Get an array that represents the "startevent"
	getStartEvent: function(peviews) {

		var pestate = {
			name: "startevent",
			index: 0,
			id: Common.uniqueId(),
			actiontype: "Eventlist",
			views: peviews
		};

		if (peviews == null) {
			// CR@CDS: It seems that peviews is never null.
			console.warn("createStartEvent: peviews is null!");
		}

		return pestate;

		// this.add(pestate);
	},

	handleAddView: function(data) {
		var viewModel = data.view;
	},

	handleChangeView: function(data) {

		var viewModel = data.view,
			hasChanged = (data.previousAttributes.name != viewModel.get("name"));

		if ( ! hasChanged) {
			return;
		}

		this.each(function(eventModel) {
			eventModel.renameView(data.previousAttributes.name, viewModel.get("name"));
		});
	},

	handleDeleteView: function(data) {

		console.log(this);
		console.log("EventCollection");
		console.log("Loop through events and remove peviewstate for view name " + data.view.get("name"));

		var viewModel = data.view;

		this.each(function(eventModel) {
			eventModel.deleteView(viewModel.get("name"));
			// console.log(eventModel.get("peviews"));
			// if (eventModel.hasScreen(viewModel.get("name"))) {

			// }
			// console.log(eventModel);
		});

		console.log(this.models);
	}

});


/*

	_dataChannel: null,
	_appChannel: null,

	initialize: function() {

		var self = this;

		this._dataChannel = Radio.channel("data");
		this._appChannel = Radio.channel("app");

		this.listenTo(this._dataChannel, "peinfo", function(data) {

			var peinfo = data.peinfo,
				evlists = peinfo.evl,
				seviews = peinfo.sev;

			self.createStartEvent(seviews);

			if (evlists.length > 0) {
				for (var pei = 0; pei < evlists.length; pei++) {
					self.add(evlists[pei]);
				}
			}
		});

		this.on("reset add change", function() {
			console.log("EventCollection");
			console.log(self);
		});

	},

	createStartEvent: function(views) {

		var state = {
			name: "startevent",
			index: 0,
			id: Common.uniqueId(),
			actiontype: "Eventlist"
		};

		if (views == null) {
			var peviewarr = [];
			for (var i = 0; i < views.length; i++) {
				var peview = {
					id: UniqueId(),
					parentid: state.id,
					viewstate: views[i].getAttr('state'),
					layerid: 'none',
					layername: 'none',
					actions: []
				};
				peviewarr.push(peview);
			}

			state.views = peviewarr;
		} else {
			state.views = views;
		}

		this.add(state);
	}

});

*/


module.exports = EventCollection;