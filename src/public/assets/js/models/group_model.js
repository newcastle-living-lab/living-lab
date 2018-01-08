"use strict";

var Bb = require("backbone");


var GroupModel = Bb.Model.extend({

	idAttribute: "name",

	defaults: {
		name: "default",
		index: 0
	},

	validate: function(attributes, options) {

		// Ensure the new group name is unique.
		// Search our collection for other groups with the new desired name.

		var existing = false,
			myId = this.cid,
			myName = attributes.name;

		var existing = this.collection.find(function(groupModel) {
			return groupModel.get("name") == myName && myId != groupModel.cid;
		});

		if (existing !== undefined) {
			return "There is another group already using the name " + existing.get("name");
		}
	}

});


module.exports = GroupModel;