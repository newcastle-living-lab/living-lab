"use strict";

var Mn = require("backbone.marionette"),
	Radio = require("backbone.radio"),
	mainTmpl = require("../templates/group_edit_view.html");


var GroupEditView = Mn.View.extend({
	tagName: "div",
	className: "panel",
	template:mainTmpl,

	ui: {
		"btn_save": "[data-ui=btn_save]",
		"btn_cancel": "[data-ui=btn_cancel]",
		"input_name": "input[name=name]"
	},

	events: {
		"click @ui.btn_cancel": "handleCancel",
		"click @ui.btn_save": "handleSave"
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
	}


});


module.exports = GroupEditView;