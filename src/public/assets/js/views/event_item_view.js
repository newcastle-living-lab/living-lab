"use strict";

var $ = require("jquery"),
	Mn = require("backbone.marionette"),
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

	ui: {
		"btn_start": "[data-ui=btn_start]",
		"btn_play": "[data-ui=btn_play]"
	},

	triggers: {
		"click @ui.btn_start": "event:start",
		"click @ui.btn_play": "event:play",
		"click": "event:select",
	},

	modelEvents: {
		"change": "render",
		"select": "setActive",
		"deselect": "setInactive"
	},

	initialize: function() {
		var self = this;
		this._storeChannel = Radio.channel("store");
	},

	onRender: function() {
		this.$el.attr("data-event-model-cid", this.model.cid);
		this.showChildView("views", new EventItemScreensView({
			collection: this._storeChannel.request("viewCollection"),
			model: this.model
		}));
	},

	setActive: function() {
		this.$el.addClass("is-active");
		if ( ! this.isVisible()) {
			this.scrollIntoView();
		}
	},

	setInactive: function() {
		this.$el.removeClass("is-active");
	},

	toggleActive: function() {
		this.$el.toggleClass("is-active");
	},

	isVisible: function() {
		var rect = this.el.getBoundingClientRect();
		var visible = (
			rect.top >= 0 &&
			rect.left >= 0 &&
			rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) && /*or $(window).height() */
			rect.right <= (window.innerWidth || document.documentElement.clientWidth) /*or $(window).width() */
		);
		return visible;
	},

	scrollIntoView: function() {
		var offset = this.$el.offset();
		$('html, body').animate({
			scrollTop: offset.top - 50,
		});
	}

});


module.exports = EventItemView;