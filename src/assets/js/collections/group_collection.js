"use strict";

var Bb = require("backbone"),
	Radio = require("backbone.radio"),
	config = require("../config/present"),
	GroupModel = require("../models/group_model");


var GroupCollection = Bb.Collection.extend({

	model: GroupModel,

	_store: null,

	initialize: function(models, options) {
		this._store = options.store || null;
	},

	createNew: function() {

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

		this.add(newGroup);
		return newGroup;
	}

});


module.exports = GroupCollection;