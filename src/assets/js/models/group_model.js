"use strict";

var Bb = require("backbone");


var GroupModel = Bb.Model.extend({

	idAttribute: "id",

	defaults: {
		id: null,
		name: "default",
		index: 0
	}

});


module.exports = GroupModel;