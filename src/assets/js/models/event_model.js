"use strict";

var _ = require("lodash"),
	Bb = require("backbone");


var EventModel = Bb.Model.extend({

	idAttribute: "id",

	defaults: {
		actiontype: "Eventlist",
		id: null,
		index: 0,
		name: "event",
		peviews: [],
		group: "default"
	},

	/**
	 * Get the "peviews" data - layer, view, and actions - for a given view name.
	 * If nothing found, _.head will return `undefined`.
	 *
	 */
	getViewData: function(viewName) {
		var screens = _.filter(this.get("peviews"), function(viewObj) {
			return (viewObj.viewstate.name == viewName);
		});
		return _.head(screens);
	}

});


module.exports = EventModel;