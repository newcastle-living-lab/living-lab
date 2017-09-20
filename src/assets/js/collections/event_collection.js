"use strict";

var Bb = require("backbone"),
	Radio = require("backbone.radio"),
	Common = require("../components/common"),
	EventModel = require("../models/event_model");


var EventCollection = Bb.Collection.extend({

	model: EventModel,

	_dispatchChannel: null,
	selectedEvent: null,

	initialize: function() {
		this._dispatchChannel = Radio.channel("dispatch");
	},


	/**
	 * Update the "index" property of each event based on their position in the collection.
	 *
	 */
	updateIndexes: function() {

		console.log("EventCollection | updateIndexes");

		this.each(function(eventModel, index) {
			// silent, to ensure the "change" handler doesn't fire a million times.
			eventModel.set({ "index": index }, { silent: true });
		});

		this.trigger("update:indexes");
	},


	/**
	 * Handle the selection of an event.
	 *
	 */
	selectEvent: function(eventModel) {

		// Keep copy of currently selected event
		this.selectedEvent = eventModel;

		// Loop through the models, and if the model is the parameter (selected model) then trigger the select event.
		// For now, only the views are interested in this - to indicate the selected state.
		this.each(function(model) {
			if (model == eventModel) {
				model.trigger("select");
			} else {
				model.trigger("deselect");
			}
		});
	},


	/**
	 * Get an array that represents the "startevent"
	 *
	 */
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

		console.log("EventCollection | renameView | Renaming view " + oldName + " -> " + newName + " on all events...");

		this.each(function(eventModel) {
			eventModel.renameView(oldName, newName);
		});
	},


	/**
	 * Handle the renaming of a group.
	 * In each event model, if the `group` attr matches `oldName`, set to `newName`.
	 *
	 */
	renameGroup: function(oldName, newName) {

		if (oldName == newName) {
			return;
		}

		console.log("EventCollection | renameGroup | Renaming group " + oldName + " -> " + newName + " on all events...");

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
	},


	createNew: function(attrs) {

		var addOptions = {},
			storeChannel = Radio.channel("store"),
			viewCollection = storeChannel.request("viewCollection");

		attrs = attrs || {};
		attrs.id = Common.uniqueId();

		var peviews = [];

		// Get views
		viewCollection.each(function(viewModel) {
			peviews.push({
				id: Common.uniqueId(),
				parentid: attrs.id,
				viewstate: viewModel.attributes,
				layerid: "none",
				layername: "none",
				actions: []
			});
		});

		attrs.peviews = peviews;

		if (this.selectedEvent) {
			addOptions.at = this.indexOf(this.selectedEvent) + 1;
		}

		var newEvent = new EventModel(attrs);
		newEvent.set("name", newEvent.get("name") + newEvent.get("id"));

		this.add(newEvent, addOptions);
		return newEvent;
	}


});


module.exports = EventCollection;