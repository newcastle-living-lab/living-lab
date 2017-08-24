"use strict";

var Mn = require("backbone.marionette"),
	Radio = require("backbone.radio"),
	EventItemView = require("./event_item_view"),
	headerTmpl = require("../templates/event_header_view.html");


var EventHeaderView = Mn.View.extend({
	tagName: "li",
	className: "event-header",
	template: headerTmpl
});


var EventListView = Mn.CollectionView.extend({

	tagName: "ul",
	className: "event-list",
	childView: EventItemView,
	template: _.noop,

	_appChannel: null,

	initialize: function() {
		this._appChannel = Radio.channel("app");
	},

	onRender: function() {
		this.addChildView((new EventHeaderView()), 0);
	}

});


module.exports = EventListView;