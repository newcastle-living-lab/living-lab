"use strict";

var Mn = require("backbone.marionette"),
	Radio = require("backbone.radio"),
	mainTmpl = require("../templates/present.html");


var PresentView = Mn.View.extend({

	tagName: "div",
	className: "panel panel-sm panel-alt add-bottom",
	template: mainTmpl,

	ui: {
		"play_mode": "[data-ui=play_mode]",
		"btn_next_event": "[data-ui=btn_next_event]"
	},

	events: {
		"click @ui.play_mode": "setPlayMode",
		"click @ui.btn_next_event": "handleNextEvent"
	},

	_dispatchChannel: null,

	initialize: function() {
		this._dispatchChannel = Radio.channel("dispatch");
	},

	setPlayMode: function() {
		var playMode = this.ui.play_mode.is(":checked");
		this._dispatchChannel.request("store:play_mode", { "playMode": playMode });
	},

	handleNextEvent: function() {
		this._dispatchChannel.request("event:next");
	}

});


module.exports = PresentView;