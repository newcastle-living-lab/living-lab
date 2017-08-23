"use strict";

var Bb = require("backbone"),
	Radio = require("backbone.radio"),
	config = require("../config/present"),
	ViewModel = require("../models/view_model");


var ViewCollection = Bb.Collection.extend({

	model: ViewModel,

	canAddView: function() {
		return (this.models.length < config.max_views);
	},

	createNew: function() {

		var newView = new ViewModel();
		var index = 0;

		if ( ! this.canAddView()) {
			console.error("Maximum number of views reached.");
			return false;
		}

		while (index <= config.max_views) {
			var tryName = newView.get("name") + index;
			if (this.findWhere({ "name": tryName })) {
				index++;
			} else {
				newView.set("name", tryName);
				break;
			}
		}

		this.add(newView);
		return newView;
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

			var views = [];

			var peinfo = data.peinfo,
				evlists = peinfo.evl,
				seviews = peinfo.sev;

			if (evlists.length > 0) {
				// first event
				var pestate = evlists[0];
				// Views for the first event
				var peviews = pestate.peviews;
				// Loop through views
				for (var vi = 0; vi < peviews.length; vi++) {
					// var view = makeView(peviews[vi].viewstate);
					self.add(peviews[vi].viewstate);
				}
			}
		});

		this.on("reset add change", function() {
			console.log("ViewCollection");
			console.log(self);
		});

	}

});
*/


module.exports = ViewCollection;