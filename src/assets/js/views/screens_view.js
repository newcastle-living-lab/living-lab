"use strict";

var Mn = require("backbone.marionette"),
	Radio = require("backbone.radio");


var ScreenButton = Mn.View.extend({
	tagName: "button",
	className: "pure-button button-hollow",
	template: _.template("<%= name %>"),
	triggers: {
		"click": "view:edit"
	},
	modelEvents: {
		"change": "render"
	}
});


var AddScreenButton = Mn.View.extend({
	tagName: "button",
	className: "pure-button",
	template: _.template("<i class='fa fa-fw fa-desktop'></i> Add View"),
	triggers: {
		"click": "view:add"
	}
});


var ScreensView = Mn.CollectionView.extend({

	tagName: "div",
	className: "button-collection",
	childView: ScreenButton,

	childViewEvents: {
		"view:add": "addView",
		"view:edit": "editView"
	},

	_dispatchChannel: null,

	initialize: function() {
		this._dispatchChannel = Radio.channel("dispatch");
	},

	onRender: function() {
		// Add the extra "Add new screen" button - doesn't need a model
		this.addChildView((new AddScreenButton()), this.collection.length);
	},

	addView: function() {
		this._dispatchChannel.request("view:add");
	},

	editView: function(childView) {
		this._dispatchChannel.request("view:edit", {
			view: childView.model
		});
	}

});


module.exports = ScreensView;