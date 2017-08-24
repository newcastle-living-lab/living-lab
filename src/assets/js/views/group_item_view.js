"use strict";

var Mn = require("backbone.marionette"),
	EventListView = require("./event_list_view"),
	mainTmpl = require("../templates/group_item_view.html");


var GroupItemView = Mn.View.extend({

	tagName: "li",
	className: "event-group-item",
	template: mainTmpl,

	regions: {
		"events": "[data-region=events]"
	},

	ui: {
		"event_count": "[data-ui=event_count]"
	},

	triggers: {
		"click .event-group-item-header": "group:toggle"
	},

	onRender: function() {

		var self = this;

		this.updateEventCount();

		this.listenTo(this.model.eventCollection, "change reset add remove", function() {
			self.updateEventCount();
		});

		this.showChildView("events", new EventListView({
			collection: this.model.eventCollection
		}));
	},

	updateEventCount: function() {
		this.ui.event_count.text(this.model.eventCollection.models.length);
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