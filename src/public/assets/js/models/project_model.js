"use strict";

var Bb = require("backbone");


var ProjectModel = Bb.Model.extend({

	defaults: {
		createdate: null,
		creator: null,
		id: null,
		lastdate: null,
		name: null,
		screenheight: null,
		screenwidth: null,
		type: "Project",
		status: null
	},

	getName: function() {

		var out = "";

		switch (this.get("status")) {
			case "newready":
				out = "(New) " + this.get("name");
			break;

			case "openready":
				out = this.get("name");
			break;

			default:
				out = "(Not ready)";
			break;
		}

		return out;
	}

});


module.exports = ProjectModel;