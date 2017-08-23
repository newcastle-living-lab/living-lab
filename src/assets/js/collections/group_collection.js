"use strict";

var Bb = require("backbone"),
	Radio = require("backbone.radio"),
	GroupModel = require("../models/group_model");


var GroupCollection = Bb.Collection.extend({
	model: GroupModel
});


module.exports = GroupCollection;