"use strict";

var Mn = require("backbone.marionette"),
	mainTmpl = require("../templates/group_item_view.html");


var GroupItemView = Mn.View.extend({

	tagName: "li",
	className: "event-group-item",
	template: mainTmpl,

	ui: {
		"event_count": "[data-ui=event_count]"
	},

	triggers: {
		"mouseup .event-group-item-header": "group:toggle"
	},

	onRender: function() {
		this.updateEventCount();
	},

	updateEventCount: function() {
		this.ui.event_count.text("2");
	},

	setActive: function() {
		this.$el.addClass("is-active");
	},

	setInactive: function() {
		this.$el.removeClass("is-active");
	},

	toggleActive: function() {
		this.$el.toggleClass("is-active");
	}

});


module.exports = GroupItemView;