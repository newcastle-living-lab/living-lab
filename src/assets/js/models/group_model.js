"use strict";

var Bb = require("backbone"),
	EventCollection = require("../collections/event_collection");


var GroupModel = Bb.Model.extend({

	idAttribute: "id",

	defaults: {
		id: null,
		name: "default",
		index: 0
	},

	initialize: function() {

		var self = this;

		this.eventCollection = new EventCollection();

		// When the master event collection changes, we need to update our own list of filtered events for "this" group
		this.listenTo(this.collection._store.eventCollection, "reset add remove", function() {
			self.updateEvents();
		});

		this.updateEvents();
	},

	updateEvents: function() {
		var filteredItems = this.collection._store.eventCollection.where({ group: this.get("name") });
		this.eventCollection.reset(filteredItems);
	}

});


module.exports = GroupModel;