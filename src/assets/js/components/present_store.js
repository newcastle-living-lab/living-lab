"use strict";

var Mn = require('backbone.marionette'),
	Radio = require("backbone.radio"),
	Common = require("../components/common"),
	config = require("../config/present"),
	GroupCollection = require("../collections/group_collection"),
	LayerCollection = require("../collections/layer_collection"),
	ViewCollection = require("../collections/view_collection"),
	EventCollection = require("../collections/event_collection");


var Store = Mn.Object.extend({

	_appChannel: null,
	_dataChannel: null,

	//list of {layerid:id,layername:name} in designscreen
	layers: [],

	//list of viewobjects with state attributes linked to physical screens/browserpages
	views: [],

	//array of present event objects
	presentevents: [],

	initialize: function() {

		var self = this;

		this._dataChannel = Radio.channel("data");
		this._appChannel = Radio.channel("app");

		this.groupCollection = new GroupCollection();
		this.viewCollection = new ViewCollection();
		this.eventCollection = new EventCollection();
		this.layerCollection = new LayerCollection();

		// (debug)
		this.listenTo(this.layerCollection, "change reset add", function(m) {
			// console.log("layerCollection");
			// console.log(m);
		});
		this.listenTo(this.eventCollection, "change reset add", function(m) {
			// console.log("eventCollection");
			// console.log(m);
		});

		// Initialise the collections/models with actual data (when received)
		this.setupGroups();
		this.setupViewEvents();
		this.setupLayers();
	},

	setupGroups: function() {
		var self = this;
		this.groupCollection.add({
			name: "default"
		});
	},

	setupViewEvents: function() {

		var self = this;

		this.listenTo(this._dataChannel, "peinfo", function(data) {

			var evlists = data.peinfo.evl,
				seviews = data.peinfo.sev;

			// Create the start event
			// self.createStartEvent(seviews);
			self.eventCollection.addStartEvent(seviews);

			if (evlists.length <= 0) {
				return;
			}

			// Create views from first entry
			//
			var peviews = evlists[0].peviews;
			// loop through the info and create the view entries
			for (var vi = 0; vi < peviews.length; vi++) {
				self.viewCollection.add(peviews[vi].viewstate);
			}

			// Create the PEs (pei = present event index)
			for (var pei = 0; pei < evlists.length; pei++) {
				self.eventCollection.add(evlists[pei]);
			}
		});

		this.listenTo(this._appChannel, "view:add", function() {

			if ( ! self.viewCollection.canAddView()) {
				this._appChannel.trigger("ui:error", {
					message: "Maximum number of screens has been reached."
				});
				return;
			}

			// Create the new view now we think we can make it
			var newView = self.viewCollection.createNew();
			if (newView) {
				// Trigger event to say a new view has been added.
				// Event listeners to this should make sure the views are added to the presentevents and are then updated over IO.
				self._appChannel.trigger("view:added", {
					view: newView
				});
			} else {
				self._appChannel.trigger("ui:error", {
					message: "Unable to create new view."
				});
			}
		});

	},

	setupLayers: function() {

		var self = this;

		// Wait for `layerinfo` data
		this.listenTo(this._dataChannel, "layerinfo", function(data) {

			// Init layers array again with "none" item first
			self.layers = [{
				layerid: "none",
				layername: "none"
			}];

			// Add the items from the incoming data
			Array.prototype.push.apply(self.layers, data.layers);

			// Reset the collection with our updated data
			self.layerCollection.reset(self.layers);
		});
	}

});


module.exports = Store;