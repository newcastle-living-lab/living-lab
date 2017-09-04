"use strict";

var _ = require("lodash"),
	Bb = require("backbone"),
	Mn = require("backbone.marionette"),
	Radio = require("backbone.radio"),
	mainTmpl = require("../templates/event_edit_view.html"),
	screenLayerTmpl = require("../templates/event_edit_screen_layer.html");

var SelectOptionView = Mn.View.extend({
	tagName: "option",
	template: _.template("<%- layername %>")
});


var SelectView = Mn.CollectionView.extend({

	tagName: "select",
	childView: SelectOptionView,

	childViewOptions: function(model, index) {

		var out = {
			attributes: {}
		};

		var thisLayerId = this.layer.get("layerid");

		if (model.get("layerid") == thisLayerId) {
			out.attributes.selected = "selected";
		}

		out.attributes.value = model.get("layerid");

		return out;
	},

	initialize: function(options) {
		this.layer = options.layer;
	}

});


var ScreenLayerItemView = Mn.View.extend({

	template: screenLayerTmpl,

	tagName: "div",
	className: "pure-control-group",

	regions: {
		"layer_list": "[data-region=layer_list]"
	},

	initialize: function(options) {
		this.layers = options.layers;
	},

	onRender: function() {
		this.showChildView("layer_list", new SelectView({
			collection: this.layers,
			layer: this.layers.findWhere({ layerid: this.model.get("layerid") }),
			attributes: {
				"name": this.model.get("viewstate").name,
			}
		}));
	}

});


/**
 * List of screens + layers
 *
 * model: eventModel
 * collection: the `peviews` array for the eventModel
 *
 * Each ItemView is a <select> list of layers for a `peviews` entry of an event.
 *
 */
var ScreenLayerListView = Mn.CollectionView.extend({

	template: _.noop(),
	childView: ScreenLayerItemView,

	_storeChannel: null,

	initialize: function() {
		this._storeChannel = Radio.channel("store");
	},

	childViewOptions: function(model, index) {
		return {
			model: model,
			event: this.model,
			// views: this.collection,
			layers: this._storeChannel.request("layerCollection")
		}
	}


});


var EventEditView = Mn.View.extend({

	tagName: "div",
	className: "panel",
	template: mainTmpl,

	regions: {
		"views": "[data-region=views]"
	},

	ui: {
		"btn_save": "[data-ui=btn_save]",
		"btn_cancel": "[data-ui=btn_cancel]",
		"btn_delete": "[data-ui=btn_delete]",
		"input_name": "input[name=name]"
	},

	events: {
		"click @ui.btn_cancel": "handleCancel",
		"click @ui.btn_save": "handleSave",
		"click @ui.btn_delete": "handleDelete"
	},

	modelEvents: {
		"remove": "destroy"
	},

	_dispatchChannel: null,
	_appChannel: null,

	initialize: function() {
		this._dispatchChannel = Radio.channel("dispatch");
		this._appChannel = Radio.channel("app");
		this._storeChannel = Radio.channel("store");
		this.layerCollection = this._storeChannel.request("layerCollection");
	},

	onRender: function() {
		this.showChildView("views", new ScreenLayerListView({
			// Make a collection out of this event's `peviews` array
			collection: new Bb.Collection(this.model.get("peviews")),
			// model: the event
			model: this.model
		}));
	},

	onAttach: function() {
		this.ui.input_name.focus();
	},

	handleCancel: function() {
		this._dispatchChannel.request("event:select", { event: null });
		this.destroy();
	},

	handleSave: function() {

		var self = this;

		// Listen once to a eventModel validation error, and just raise it to the UI.
		this.model.once("invalid", function(eventModel, error) {
			self._appChannel.request("ui:error", {
				message: error
			});
		});

		// Update the model with the new props
		// Because we pass {validate: true}, `update` will be false if the validation fails.
		// var update = this.model.set({ "name": this.ui.input_name.val() }, { validate: true });

		var attrs = {},
			setOptions = { silent: false };

		if (this.model.get("name") !== "startevent") {
			attrs.name = this.ui.input_name.val();
			setOptions.validate = true;
		}

		var peviews = this.model.get("peviews");

		_.each(peviews, function(viewdata, idx) {

			var viewName = viewdata.viewstate.name,
				$input = self.$("select[name=" + viewName + "]"),
				selectedLayerId = $input.find(":selected").val(),
				layerModel = self.layerCollection.findWhere({ layerid: selectedLayerId });

			// console.log("peviews index " + idx + " and viewname " + viewName + " should be set to layername " + layerModel.get("layername"))

			peviews[idx].layerid = layerModel.get("layerid");
			peviews[idx].layername = layerModel.get("layername");
		});

		// We need to quietly unset the peviews.
		// Otherwise, just setting the array again doesn't trigger "change" event
		this.model.unset("peviews", { silent: true });

		attrs.peviews = peviews;

		var update = this.model.set(attrs, setOptions);

		if (update) {
			// Only remove the view if the change is successful.
			this.destroy();
		}
	},

	handleDelete: function() {
		this._appChannel.trigger("event:confirm_delete", { event: this.model });
	}


});


module.exports = EventEditView;