"use strict";

var Mn = require("backbone.marionette"),
	Radio = require("backbone.radio"),
	mainTmpl = require("../templates/view_edit_view.html");


var ViewEditView = Mn.View.extend({

	tagName: "div",
	className: "panel",
	template:mainTmpl,

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
	},

	onAttach: function() {
		this.ui.input_name.focus();
	},

	handleCancel: function() {
		this.destroy();
	},

	handleSave: function() {

		var self = this;

		// Listen once to a viewModel validation error, and just raise it to the UI.
		this.model.once("invalid", function(viewModel, error) {
			self._appChannel.request("ui:error", {
				message: error
			});
		});

		// Update the model with the new name.
		// Because we pass {validate: true}, `update` will be false if the validation fails.
		var update = this.model.set({ "name": this.ui.input_name.val() }, { validate: true });

		if (update) {
			// Only remove the view if the name change is successful.
			this.destroy();
		}
	},

	handleDelete: function() {
		this._dispatchChannel.request("view:delete", { view: this.model });
	}


});


module.exports = ViewEditView;