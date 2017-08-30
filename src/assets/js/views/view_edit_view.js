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
		"destroy": "destroy"
	},

	_appChannel: null,

	initialize: function() {
		this._appChannel = Radio.channel("app");
	},

	onAttach: function() {
		this.ui.input_name.focus();
	},

	handleCancel: function() {
		this.destroy();
	},

	handleSave: function() {
		this.model.set("name", this.ui.input_name.val());
		this.destroy();
	},

	handleDelete: function() {
		this._appChannel.trigger("view:delete", { view: this.model });
	}


});


module.exports = ViewEditView;