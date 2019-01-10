USEIO = true;

var socket;

var serverurl = 'http://' + window.location.hostname + ':' + window.location.port;
serverurl = serverurl.replace(/:$/, '');

var playentevents = [];  //array of playent event objects

// array of present event objects/data
var presentEvents = [];

// "active" index of presentEvents
var activeIdx = -1;

// snapshots of object states at start and end of each presentevent
var snapshots;

// Project info
var screenwidth, screenheight, txscale;
var peinfo;

/**
 * Load the project JSON
 *
 */
function loadProject() {

	$.getJSON(serverurl + "/player/" + project.slug + ".json")
		.fail(function(jqxhr, textStatus, error) {
			var res = jqxhr.responseJSON;
			if (res.errors && res.errors.length > 0) {
				alert(res.errors.join(" "));
			}
		})
		.done(function(res) {
			peinfo = res.data;
			initProject();
		})
		.always(function() {
			// Remove loading UI
			$("[data-ui='loading']").remove();
		});

}


/**
 * Get vars and parse the events/views
 *
 */
function initProject() {

	// Gather data
	screenwidth = peinfo.screenwidth;
	screenheight = peinfo.screenheight;
	txscale = peinfo.txscale;
	var evlists = peinfo.pestates;
	snapshots = peinfo.layersnapshots;

	// get views from first entry
	if (evlists.length > 0) {

		var pestate = evlists[0];
		var peviews = pestate.peviews;

		for (var vi = 0; vi < peviews.length; vi++) {
			// Create UI element for view
			makeView(peviews[vi].viewstate);
			// views.push(view);
		}

		for (var pei = 0; pei < evlists.length; pei++) {
			presentEvents.push(evlists[pei]);
		}
	}
}


/**
 * Create the HTML element for each view link
 *
 */
function makeView(state) {

	var $target = $("[data-ui='views']");
	var $unit = $("<div class='pure-u-1 pure-u-md-1-2 pure-u-lg-1-4'></div>");
	var $link = $("<a>");

	$link.attr({
		"href": serverurl + "/player/" + project.slug + "/" + state.name,
		"target": "_blank",
		"data-view": state.name,
		"class": "view-link"
	});
	$link.text(state.name);

	$link.appendTo($unit);
	$unit.appendTo($target);

	console.log("Created element for view '" + state.name + "'.");
}


function playEventIdx(idx) {
	console.log("Playing event index " + idx + ": " + presentEvents[idx].name);
	txstartStatetoScreens(idx);
	setTimeout(function() {
		txplayEventtoScreens(idx);
	}, 200);
	activeIdx = idx;
}


function goPrevEvent() {
	var newIdx = activeIdx - 1;
	if (newIdx < 0) {
		newIdx = 0;
	}
	playEventIdx(newIdx);
}


function goNextEvent() {
	var newIdx = activeIdx + 1;
	if (newIdx == presentEvents.length) {
		newIdx = 0;
	}
	playEventIdx(newIdx);
}


function goStartEvent() {
	playEventIdx(0);
}


function txplayEventtoScreens(idx) {
	var pevstate = presentEvents[idx];
	for (var pei = 0; pei < pevstate.peviews.length; pei++) {
		var peview = pevstate.peviews[pei];
		var scrname = "player:" + project.slug + ":" + peview.viewstate.name;
		var layerid = peview.layerid;
		if (layerid != 'none' && peview.actions.length > 0) {
			var scrcommand = {
				view: scrname,
				scrtxmsg: {
					command: 'play',
					info: ''
				}
			};
			var scrjson = JSON.stringify(scrcommand);
			socket.emit('screenmsg', scrjson);
		}
	}
}

function txstartEventtoScreens(peobj) {
	//message to screens to go to startstate
	var ind = playentevents.indexOf(peobj);
	//message to screen to go to startstate
	var pevstate = peobj.getAttr('state');
	for (var pei = 0; pei < pevstate.peviews.length; pei++) {
		var peview = pevstate.peviews[pei];
		var scrname = "player:" + project.slug + ":" + peview.viewstate.name;
		var layerid = peview.layerid;
		if (layerid != 'none' && peview.actions.length > 0) {
			var scrcommand = {
				view: scrname,
				scrtxmsg: {
					command: 'start',
					info: ''
				}
			};
			var scrjson = JSON.stringify(scrcommand);
			socket.emit('screenmsg', scrjson);
		}
	}
}


/**
 * Find a layer in a snapshot list
 *
 */
function findPeviewLayer(layerid, snapshotlayers) {
	var found = false;
	var i = 0;
	var index = -1;
	while (found == false && i < snapshotlayers.length) {
		if (layerid == snapshotlayers[i].layerid) {
			found = true;
			index = i;
		}
		i = i + 1;
	}
	return index;
}


function txstartStatetoScreens(idx) {
	var pevstate = presentEvents[idx];
	var snapstate = snapshots[idx];

	for (var pei = 0; pei < pevstate.peviews.length; pei++) {
		var peview = pevstate.peviews[pei];
		var scrname = "player:" + project.slug + ":" + peview.viewstate.name;
		var layerid = peview.layerid;
		//console.log(layerid);
		if (layerid != 'none') {

			layerind = findPeviewLayer(layerid, snapstate);

			var screenstate = {
				screenwidth: screenwidth,
				screenheight: screenheight,
				txscale: txscale,
				viewstate: peview.viewstate,
				layerchildren: snapstate[layerind].objstates,
				layeractions: snapstate[layerind].layeractions
			};

			var scrcommand = {
				view: scrname,
				scrtxmsg: {
					command: 'update',
					info: screenstate
				}
			};
			//console.log(scrcommand);
			var scrjson = JSON.stringify(scrcommand);
			socket.emit('screenmsg', scrjson);
		}
	}
}


function txClickEvent(eventId) {
	var eventIdx = findEventById(eventId);
	playEventIdx(eventIdx);
}


function findEventById(eventId) {
	var found = false;
	var i = 0;
	var index = -1;
	while (found == false && i < presentEvents.length) {
		if (eventId == presentEvents[i].id) {
			found = true;
			index = i;
		}
		i = i + 1;
	}
	return index;
}


function ioUpdate(respdata) {
	var viewcommand = JSON.parse(respdata);
	var command = viewcommand.command;

	//console.log(command);
	switch (command) {
		case "clickEvent":
			// Parse viewName
			if (viewcommand.project && viewcommand.project == project.slug) {
				txClickEvent(viewcommand.info);
			}
		break;

		case "newEventIdx":
			if (viewcommand.project == project.slug) {
				// It's us!
				console.log("Updating local active index to " + viewcommand.newEventIdx + " from other screen " + viewcommand.view);
				activeIdx = viewcommand.newEventIdx;
			}
		break;
	}

}


function setup() {

	/**
	 * Initial set up
	 *
	 */
	if (USEIO) {
		socket = io(serverurl);
		socket.on('updateEvents', function(respdata) {
			ioUpdate(respdata);
		});
	}

	loadProject();

}
