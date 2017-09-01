"use strict";

var Mn = require("backbone.marionette"),
	Radio = require("backbone.radio"),
	config = require("../config/present"),
	mainTmpl = require("../templates/event_item_view.html"),
	screenViewTmpl = require("../templates/event_item_screen_view.html");


var EventItemScreenView = Mn.View.extend({

	tagName: "div",
	template: screenViewTmpl,

	className: function() {
		return "pure-u-1 pure-u-md-1-" + config.max_views;
	},

	modelEvents: {
		"change": "render"
	},

	initialize: function(options) {
		this.event = options.event;
		this.viewData = this.event.getViewData(this.model.get("name"));
	},

	serializeData: function() {

		var data = {
			event: _.clone(this.event.attributes),
			view_data: _.clone(this.viewData)
		}

		return data;
	}

});


var EventItemScreensView = Mn.CollectionView.extend({

	tagName: "div",
	className: "pure-g",
	childView: EventItemScreenView,
	template: _.noop(),

	childViewOptions: function() {
		return {
			event: this.model
		}
	}

});


var EventItemView = Mn.View.extend({

	tagName: "li",
	className: "event-item",
	template: mainTmpl,

	regions: {
		"views": "[data-region=views]"
	},

	triggers: {
		"click": "event:toggle"
	},

	initialize: function() {
		var self = this;
		this._storeChannel = Radio.channel("store");
	},

	onRender: function() {
		this.showChildView("views", new EventItemScreensView({
			collection: this._storeChannel.request("viewCollection"),
			model: this.model
		}));
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


module.exports = EventItemView;