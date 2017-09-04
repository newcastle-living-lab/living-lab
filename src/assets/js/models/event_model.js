"use strict";

var _ = require("lodash"),
	Bb = require("backbone"),
	Common = require("../components/common");


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

	validate: function(attributes, options) {
		if (attributes.name === "startevent") {
			return "It is not possible to use the name 'startevent' in other events.";
		}
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
	},

	addView: function(viewModel) {

		var peviews = this.get("peviews"),
			view = {};

		if (this.get("name") == "startevent") {
			view = {
				viewstate: viewModel.attributes,
				layerid: "none",
				layername: "none"
			};
		} else {
			view = {
				id: Common.uniqueId(),
				viewstate: viewModel.attributes,
				layerid: "none",
				layername: "none",
				actions: []
			};
		}

		peviews.push(view);
		this.set("peviews", peviews);
	},

	renameView: function(oldName, newName) {

		var peviews = this.get("peviews");

		_.each(peviews, function(item, idx) {
			if (peviews[idx].viewstate.name == oldName) {
				peviews[idx].viewstate.name = newName;
			}
		});

		this.set("peviews", peviews);
	},

	renameGroup: function(oldName, newName) {
		if (this.get("group") == oldName) {
			this.set("group", newName);
		}
	},

	deleteView: function(viewName) {

		// Get copy of our peviews
		var peviews = this.get("peviews"),
			matchingIdx = null;

		_.each(peviews, function(item, idx) {
			if (item.viewstate.name == viewName) {
				matchingIdx = idx;
				return false;
			}
		});

		if (matchingIdx !== null) {
			// console.log("Removing array index " + matchingIdx + " for " + viewName);
			// Remove the view data at the found index
			peviews.splice(matchingIdx, 1);
			this.set("peviews", peviews);
		} else {
			// Can't find the view in this model's data matching the viewName
			// console.log("matchingIdx is still null");
		}
	}

});


module.exports = EventModel;