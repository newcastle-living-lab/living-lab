"use strict";

var Bb = require("backbone"),
	Radio = require("backbone.radio"),
	config = require("../config/present"),
	ViewModel = require("../models/view_model");


var ViewCollection = Bb.Collection.extend({

	model: ViewModel,

	_dispatchChannel: null,


	initialize: function() {
		this._dispatchChannel = Radio.channel("dispatch");
		this.on("change:name", this.handleChangeName);
	},


	/**
	 * When a view model name changes, we need to raise the event on the dispatch channel.
	 * The intention of the action for this event is to update all the `peviews` info in the event models.
	 *
	 */
	handleChangeName: function(viewModel) {

		var oldName = viewModel.previous("name"),
			newName = viewModel.get("name");

		this._dispatchChannel.request("view:rename", {
			oldName: oldName,
			newName: newName,
			viewModel: viewModel
		});

	},


	/**
	 * Determine if a new view can be added, based on current number of views and maximum views supported.
	 *
	 */
	canAddView: function() {
		return (this.models.length < config.max_views);
	},


	/**
	 * Add a new view.
	 *
	 * If a new view can be made, create one with a suitable name, add it to the collection, and return it.
	 *
	 */
	createNew: function() {

		if ( ! this.canAddView()) {
			console.error("Maximum number of views reached.");
			return false;
		}

		var newView = new ViewModel();
		var index = 0;

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


module.exports = ViewCollection;