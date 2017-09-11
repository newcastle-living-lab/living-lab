"use strict";

var Mn = require('backbone.marionette'),
	Radio = require("backbone.radio"),
	Common = require("../components/common"),
	config = require("../config/present"),
	GroupCollection = require("../collections/group_collection"),
	LayerCollection = require("../collections/layer_collection"),
	ViewCollection = require("../collections/view_collection"),
	EventCollection = require("../collections/event_collection"),
	ProjectModel = require("../models/project_model");


var Store = Mn.Object.extend({

	_appChannel: null,
	_dataChannel: null,
	_storeChannel: null,

	groupCollection: null,
	viewCollection: null,
	eventCollection: null,
	layerCollection: null,

	//list of {layerid:id,layername:name} in designscreen
	layers: [],

	//list of viewobjects with state attributes linked to physical screens/browserpages
	views: [],

	//array of present event objects
	presentevents: [],

	playMode: false,

	initialize: function() {

		var self = this;

		this._dataChannel = Radio.channel("data");
		this._appChannel = Radio.channel("app");
		this._storeChannel = Radio.channel("store");

		this.groupCollection = new GroupCollection();
		this.viewCollection = new ViewCollection();
		this.eventCollection = new EventCollection();
		this.layerCollection = new LayerCollection();
		this.projectModel = new ProjectModel();

		this._storeChannel.reply("groupCollection", function() {
			return self.groupCollection;
		});

		this._storeChannel.reply("viewCollection", function() {
			return self.viewCollection;
		});

		this._storeChannel.reply("eventCollection", function() {
			return self.eventCollection;
		});

		this._storeChannel.reply("layerCollection", function() {
			return self.layerCollection;
		});

		this._storeChannel.reply("projectModel", function() {
			return self.projectModel;
		});

		this._storeChannel.reply("store", function() {
			return self;
		});

	},

	setPlayMode: function(playMode) {
		console.log("Store | setPlayMode | " + playMode);
		this.playMode = playMode;
	},

	getPlayMode: function() {
		return this.playMode
	}

});

module.exports = Store;