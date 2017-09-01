"use strict";

var Bb = require("backbone");


var ViewModel = Bb.Model.extend({

	idAttribute: "name",

	defaults: {
		name: "view"
	},

	validate: function(attributes, options) {

		// Ensure the new view name is unique.
		// Search our collection for other views with the new desired name.

		var existing = false,
			myId = this.cid,
			myName = attributes.name;

		var existing = this.collection.find(function(viewModel) {
			return viewModel.get("name") == myName && myId != viewModel.cid;
		});

		if (existing !== undefined) {
			return "There is another view already using the name " + existing.get("name");
		}
	}

});


module.exports = ViewModel;