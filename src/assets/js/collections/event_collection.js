"use strict";

var Bb = require("backbone"),
	Radio = require("backbone.radio"),
	Common = require("../components/common"),
	EventModel = require("../models/event_model");


var EventCollection = Bb.Collection.extend({

	model: EventModel,

	// Get an array that represents the "startevent"
	getStartEvent: function(peviews, groupName) {

		var pestate = {
			name: "startevent",
			index: 0,
			id: Common.uniqueId(),
			actiontype: "Eventlist",
			peviews: peviews,
			group: groupName
		};

		if (peviews == null) {
			// CR@CDS: It seems that peviews is never null.
			console.warn("createStartEvent: peviews is null!");
		}

		return pestate;
	},


	/**
	 * Add a new viewModel to each event model in this collection.
	 *
	 */
	addView: function(viewModel) {

		console.log("EventCollection | addView | Adding " + viewModel.get("name") + " to events...");

		this.each(function(eventModel) {
			eventModel.addView(viewModel);
		});
	},


	/**
	 * Handle the renaming of a view.
	 * In each event, find the view that has the name of `oldName` and change to `newName`.
	 *
	 */
	renameView: function(oldName, newName) {

		if (oldName == newName) {
			return;
		}

		this.each(function(eventModel) {
			eventModel.renameView(oldName, newName);
		});
	},


	renameGroup: function(oldName, newName) {

		if (oldName == newName) {
			return;
		}

		this.each(function(eventModel) {
			eventModel.renameGroup(oldName, newName);
		});
	},


	/**
	 * Handle the deletion of a view.
	 * In each event model in this collection, remove the view object from "peviews" where the viewstate name matches the viewModel's name.
	 *
	 */
	deleteView: function(viewModel) {
		console.log("EventCollection | deleteView | Removing " + viewModel.get("name") + " from events...");
		this.each(function(eventModel) {
			eventModel.deleteView(viewModel.get("name"));
		});
	}

});


module.exports = EventCollection;