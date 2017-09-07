"use strict";

var $ = require("jquery"),
	Mn = require("backbone.marionette"),
	Radio = require("backbone.radio"),
	Sortable = require("sortablejs"),
	GroupItemView = require("./group_item_view");


var GroupListView = Mn.CollectionView.extend({

	tagName: "ul",
	className: "event-group-list",
	childView: GroupItemView,
	template: _.noop,

	childViewEvents: {
		"group:toggle": "toggleGroup",
		"group:edit": "editGroup",
		"event:add": "addEvent"
	},

	_appChannel: null,
	_dispatchChannel: null,

	initialize: function(options) {
		this._appChannel = Radio.channel("app");
		this._dispatchChannel = Radio.channel("dispatch");
		this._viewCollection = options.views || null;
		this.listenTo(this._appChannel, "group:active", this.handleActive);
	},

	onAttach: function() {

		var self = this;

		var sortable = Sortable.create(this.el, {

			group: {
				name: "groups",
				pull: true,
				put: ["groups"]
			},
			draggable: ".event-group-item",
			animation: 100,

			onStart: function(event) {
				return false;
			},

			onUpdate: function(event) {

				// Handle the dropping of group items.

				// Get model cid from the view's element (set in GroupItemView)
				var modelCid = $(event.item).data("group-model-cid");
				// Get model by cid
				var model = self.collection.get(modelCid);

				// Quietly remove the model and re-insert at the new index.
				self.collection.remove(model, { silent: true });
				self.collection.add(model, { at: event.newIndex, silent: true });
				// Tell the collection to update the "index" property of each groupModel
				self.collection.updateIndexes();
				// Request comms update to send the data with the updated order.
				self._dispatchChannel.request("io:send_events");
			}
		});
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