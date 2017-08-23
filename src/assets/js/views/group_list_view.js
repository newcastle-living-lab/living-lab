"use strict";

var Mn = require("backbone.marionette"),
	Radio = require("backbone.radio"),
	GroupItemView = require("./group_item_view");


var GroupListView = Mn.CollectionView.extend({

	tagName: "ul",
	className: "event-group-list",
	childView: GroupItemView,
	template: _.noop,

	childViewEvents: {
		"group:toggle": "toggleGroup"
	},

	_appChannel: null,

	initialize: function() {
		this._appChannel = Radio.channel("app");
		this.listenTo(this._appChannel, "group:active", this.handleActive);
	},

	toggleGroup: function(childView) {
		childView.toggleActive();
	},

	handleActive: function(data) {

		console.log("handleActive");
		console.log(data);

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

		// if single group, then toggle it's status
		// if "expand" then set all to active
		// if "collapse" then set all to collapsed
	}

});


module.exports = GroupListView;