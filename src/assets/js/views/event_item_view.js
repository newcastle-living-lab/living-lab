"use strict";

var Mn = require("backbone.marionette"),
	mainTmpl = require("../templates/event_item_view.html");


var EventItemView = Mn.View.extend({

	tagName: "li",
	className: "event-item",
	template: mainTmpl

});


module.exports = EventItemView;