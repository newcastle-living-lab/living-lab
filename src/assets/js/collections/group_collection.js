"use strict";

var Bb = require("backbone"),
	Radio = require("backbone.radio"),
	config = require("../config/present"),
	GroupModel = require("../models/group_model");


var GroupCollection = Bb.Collection.extend({

	model: GroupModel,
	comparator: "index",

	_dispatchChannel: null,


	initialize: function() {
		this._dispatchChannel = Radio.channel("dispatch");
		this.on("change:name", this.handleChangeName);
		// this.on("add remove", this.handleAddRemove);
	},



	/**
	 * When a group model name changes, we need to raise the event on the dispatch channel.
	 * The intention of the action for this event is to update all the event models to change the "group" attribute.
	 *
	 */
	handleChangeName: function(groupModel) {

		var oldName = groupModel.previous("name"),
			newName = groupModel.get("name");

		this._dispatchChannel.request("group:rename", {
			oldName: oldName,
			newName: newName,
			groupModel: groupModel
		});

	},


	updateIndexes: function() {
		this.each(function(groupModel, index) {
			groupModel.set({ "index": index }, { silent: true });
		});

		this.trigger("update:indexes");
	},


	/**
	 * Determine if a new group can be added, based on current number of groups and maximum groups permitted.
	 *
	 */
	canAddGroup: function() {
		return (this.models.length < config.max_groups);
	},


	/**
	 * Add a new group.
	 *
	 * If a new group can be made, create one with a suitable name, add it to the collection, and return it.
	 *
	 */
	createNew: function() {

		if ( ! this.canAddGroup()) {
			console.error("Maximum number of groups reached.");
			return false;
		}

		var newGroup = new GroupModel({ name: "group" });
		var index = 0;

		while (index <= config.max_groups) {
			var tryName = newGroup.get("name") + index;
			if (this.findWhere({ "name": tryName })) {
				index++;
			} else {
				newGroup.set("name", tryName);
				break;
			}
		}

		var maxIndex = this.max(function(groupModel) {
			return groupModel.get("index");
		});

		// console.log("maxIndex");
		// console.log(maxIndex);

		//newGroup.set("index", parseInt(maxIndex.get("index"), 10) + 1);

		this.add(newGroup, { at: this.length });
		return newGroup;
	}


});


module.exports = GroupCollection;