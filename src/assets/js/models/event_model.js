"use strict";

var Bb = require("backbone");


var EventModel = Bb.Model.extend({

	idAttribute: "id",

	defaults: {
		actiontype: "Eventlist",
		id: null,
		index: 0,
		name: "event",
		peviews: [],
		group: "default"
	}

});


module.exports = EventModel;