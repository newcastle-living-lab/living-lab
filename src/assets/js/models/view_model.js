"use strict";

var Bb = require("backbone");


var ViewModel = Bb.Model.extend({

	idAttribute: "name",

	defaults: {
		name: "view"
	}

});


module.exports = ViewModel;