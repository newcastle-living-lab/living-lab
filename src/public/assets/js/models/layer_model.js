"use strict";

var Bb = require("backbone");


var LayerModel = Bb.Model.extend({

	idAttribute: "layerid",

	defaults: {
		layerid: null,
		layername: null
	}

});


module.exports = LayerModel;