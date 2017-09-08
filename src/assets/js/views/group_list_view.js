"use strict";

var $ = require("jquery"),
	Mn = require("backbone.marionette"),
	Radio = require("backbone.radio"),
	GroupItemView = require("./group_item_view");


var GroupListView = Mn.CollectionView.extend({

	tagName: "ul",
	className: "event-group-list",
	childView: GroupItemView,
	template: _.noop,

	events: {
		"dom:refresh": "onDomRefresh"
	},

	childViewEvents: {
		"group:toggle": "toggleGroup",
		"group:edit": "editGroup",
		"event:add": "addEvent",
		"attach": "onChildAttach"
	},

	_appChannel: null,
	_dispatchChannel: null,

	initialize: function(options) {

		var self = this;

		this._appChannel = Radio.channel("app");
		this._dispatchChannel = Radio.channel("dispatch");
		this._viewCollection = options.views || null;
		this.listenTo(this._appChannel, "group:active", this.handleActive);

		this.$el.on("sortupdate", function(e) {
			self._dispatchChannel.request("store:sort", {
				list: "groups",
				sortable: e.detail
			});
		});
	},

	onDomRefresh: function() {
		this._appChannel.trigger("ui:reload_sortables");
	},

	onChildAttach: function() {
		if (this.isAttached() && this.isRendered()) {
			this._appChannel.trigger("ui:reload_sortables");
		}
	},

	toggleGroup: function(childView) {
		childView.toggleActive();
	},

	editGroup: function(childView) {
		this._dispatchChannel.request("group:edit", { group: childView.model });
	},

	addEvent: function(childView) {
		this._dispatchChannel.request("event:add", { group: childView.model });
	},

	handleActive: function(data) {

		if (data && data.action && data.target === undefined) {

			// Loop through all children and set as active/inactive
			this.children.each(function(child) {
				switch (data.action) {
					case "expand": child.setActive(); break;
					case "collapse": child.setInactive(); break;
				}
			});

			return;
		}
	}

});


module.exports = GroupListView;