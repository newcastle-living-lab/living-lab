"use strict";

var Bb = require("backbone"),
	Radio = require("backbone.radio"),
	LayerModel = require("../models/layer_model");


var LayerCollection = Bb.Collection.extend({
	model: LayerModel
});


module.exports = LayerCollection;