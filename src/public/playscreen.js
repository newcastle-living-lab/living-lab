USEIO = true;
var socket;
var serverurl = 'http://' + window.location.hostname + ':' + window.location.port;
var fullscreen = false;
var maxviews = 4;
var prw, prh;
var playstage, playlayer;
var evbutspacewidth = 150;
var views = [];  //list of viewobjects with state attributes linked to physical screens/browserpages
var viewNames = [];  // names of views
var layers = [];  //list of {layerid:id,layername:name} in designscreen
var viewnonselcol = '#ddddee';
var viewselectcol = '#ccddee';
var viewwidth = 150;
var viewgap = 30;
var viewheight = 300;
var viewtextspace = 15;
var viewXoffset = 50;
var viewYoffset = 30;
var playenteventoffset = 25;
var playenteventgap = 5;
var prmargin = 5;
var prstagew = evbutspacewidth + viewXoffset + maxviews * viewwidth + (maxviews - 1) * viewgap + 2 * prmargin;
var prstageh = viewYoffset + viewheight + viewtextspace + prmargin;
var playentevents = [];  //array of playent event objects
var peevobjh = 30;
var peevobjw = maxviews * viewwidth + (maxviews - 1) * viewgap;
var peevnonselcol = '#ccdddd';
var peevselectcol = '#ffffaa';
var activepeevobj = null;
var activeviewobj = null;
var actobjw = 100;
var actobjh = 15;
var actobjgap = 2;
var designready = false;
var mousedown_action = false;
var playmode = false;
var loopmode = false;
var sspeevnonselcol = '#ccddcc';
var sspeevselectcol = '#aaaaff';
var snapshots;  //snapshots of object states at start and end of each presentevent
var screenwidth, screenheight, txscale;
var audiodev = 'local';
var sounds = {};

var keys = {
	PGUP: 33,
	PGDN: 34,
	LEFT: 37,
	RIGHT: 39,
	SPACE: 32,
	ENTER: 13,
};

serverurl = serverurl.replace(/:$/, '');


function updatePresentEvent(pev) {
	var pevstate = pev.getAttr('state');
	//delete old action labels
	var oldactions = pev.find('.actionname').toArray();
	for (var j = 0; j < oldactions.length; j++) {
		oldactions[j].destroy();
	}

	//make new updated ones and adjust height of PE
	var peviews = pevstate.peviews;
	var numactions = 0;
	for (var i = 0; i < peviews.length; i++) {
		var actions = peviews[i].actions;
		var nac = actions.length;
		if (nac > numactions) { numactions = nac; }
		for (var ai = 0; ai < actions.length; ai++) {
			var actstate = actions[ai];
			var actobj = new Konva.Text({
				name: 'actionname',
				draggable: false,
				x: (i * (viewwidth + viewgap)) + viewXoffset + evbutspacewidth + 3,  //align with view
				y: 3 + ai * (actobjh + actobjgap),
				text: actstate.name,
				fontSize: 12,
				fill: 'black'
			});
			pev.add(actobj);
			actobj.moveToTop();
		}


	}

	if (numactions * (actobjh + actobjgap) < peevobjh) {
		pev.find('.peevblock')[0].height(peevobjh);
	} else {
		pev.find('.peevblock')[0].height(numactions * (actobjh + actobjgap));
	}

	var yoffset = viewYoffset + playenteventoffset + peevobjh + playenteventgap;
	for (var j = 0; j < pevstate.index; j++) {
		var pevnt = playentevents[j];
		if (pevnt !== undefined) {
			var block = pevnt.find('.peevblock')[0];
			yoffset = yoffset + block.height() + playenteventgap;
		}
	}
	pev.y(yoffset);
	playlayer.draw();

}



function makePresentEvent(state) {

	var peevobj = new Konva.Group({
		name: 'playentevent',
		draggable: false,
		id: state.id,
		x: prmargin,
		y: viewYoffset,
		width: peevobjw + evbutspacewidth + viewXoffset,
		height: peevobjh
	});

	peevobj.setAttr('state', state);

	var peevblock = new Konva.Rect({
		name: 'peevblock',
		draggable: false,
		x: 0,
		y: 0,
		width: peevobjw + evbutspacewidth + viewXoffset,
		height: peevobjh,
		cornerRadius: 0,
		fill: peevnonselcol,
		stroke: 'black',
		strokeWidth: 1
	});


	var nameobj = new Konva.Text({
		name: 'peevname',
		draggable: false,
		x: 5,
		y: 5,
		text: state.name,
		fontSize: 12,
		fill: 'black'

	});

	var startbutton = new Konva.RegularPolygon({
		x: 150,
		y: 15,
		draggable: false,
		sides: 3,
		radius: 10,
		rotation: -90,
		fill: '#000'
	});

	var playbutton = new Konva.RegularPolygon({
		x: 170,
		y: 15,
		draggable: false,
		sides: 3,
		radius: 10,
		rotation: 90,
		fill: '#000'
	});

	peevobj.add(peevblock);
	peevobj.add(nameobj);
	peevobj.add(startbutton);
	peevobj.add(playbutton);
	startbutton.moveToTop();
	playbutton.moveToTop();


	playlayer.add(peevobj);

	startbutton.on('mouseover', function () {
		document.body.style.cursor = 'pointer';
		cursorstate = 'onpeev';
	});

	startbutton.on('mouseout', function () {
		document.body.style.cursor = 'default';
		cursorstate = 'free';
	});


	startbutton.on('mousedown tap', function () {
		//this.fill('#ff5555');
		mousedown_action = true;
		if (activepeevobj == this.getParent()) {
			txstartEventtoScreens(activepeevobj);
		}


	});

	playbutton.on('mouseover', function () {
		document.body.style.cursor = 'pointer';
		cursorstate = 'onpeev';
	});

	playbutton.on('mouseout', function () {
		document.body.style.cursor = 'default';
		cursorstate = 'free';
	});

	playbutton.on('mousedown tap', function () {
		//this.fill('#ff5555');
		mousedown_action = true;
		if (activepeevobj == this.getParent()) {
			txplayEventtoScreens(activepeevobj);
		}


	});

	peevobj.on('mousedown tap', function () {
		if (mousedown_action == false) {
			activepeevobj = this;
			//mousedown_action = true;
			var pechildren = playlayer.getChildren().toArray();
			for (var i = 0; i < pechildren.length; i++) {
				var selobj = pechildren[i];
				if (activepeevobj == selobj) {
					selobj.find('.peevblock').fill(peevselectcol);
				}
				else {
					selobj.find('.peevblock').fill(peevnonselcol);
				}

			}
			playlayer.draw();
			txstartStatetoScreens(activepeevobj);

			if (playmode == true) {
				setTimeout(function () { txplayEventtoScreens(activepeevobj); }, 200);
			}

		}
		else {
			mousedown_action = false;
		}


	});

	playentevents.push(peevobj);
	updatePresentEvent(peevobj);
	updateViews();

	return peevobj;
}

function makeStartEvent(peviews) {
	var ind = 0;
	var pestate = { name: 'startevent', index: ind, id: 'start', actiontype: 'Eventlist' };
	if (peviews == null) {
		var peviewarr = [];
		for (var i = 0; i < views.length; i++) {
			var peview = { id: 'start' + i.toString(), parentid: pestate.id, viewstate: views[i].getAttr('state'), layerid: 'none', layername: 'none', actions: [] };
			peviewarr.push(peview);
		}

		pestate.peviews = peviewarr;
	}
	else {
		pestate.peviews = peviews;
	}

	var peevobj = new Konva.Group({
		name: 'startevent',
		draggable: false,
		id: pestate.id,
		x: prmargin,
		y: viewYoffset,
		width: peevobjw + evbutspacewidth + viewXoffset,
		height: peevobjh
	});

	peevobj.setAttr('state', pestate);

	var peevblock = new Konva.Rect({
		name: 'peevblock',
		draggable: false,
		x: 0,
		y: 0,
		width: peevobjw + evbutspacewidth + viewXoffset,
		height: peevobjh,
		cornerRadius: 0,
		fill: sspeevnonselcol,
		stroke: 'black',
		strokeWidth: 1
	});


	var nameobj = new Konva.Text({
		name: 'peevname',
		draggable: false,
		x: 5,
		y: 5,
		text: pestate.name,
		fontSize: 12,
		fill: 'black'

	});


	peevobj.add(peevblock);
	peevobj.add(nameobj);


	playlayer.add(peevobj);


	peevobj.on('mousedown tap', function () {
		if (mousedown_action == false) {
			activepeevobj = this;
			//mousedown_action = true;
			var pechildren = playlayer.getChildren().toArray();
			for (var i = 0; i < pechildren.length; i++) {
				var selobj = pechildren[i];
				if (activepeevobj == selobj) {
					selobj.find('.peevblock').fill(sspeevselectcol);
				}
				else {
					selobj.find('.peevblock').fill(sspeevnonselcol);
				}

			}
			playlayer.draw();

		}
		else {
			mousedown_action = false;
		}


	});

	var yoffset = viewYoffset + playenteventoffset;
	peevobj.y(yoffset);
	playlayer.draw();

	return peevobj;
}



function updateViews() {
	var newheight = playenteventoffset;
	var newheight = playenteventoffset + peevobjh + playenteventgap;

	for (var pei = 0; pei < playentevents.length; pei++) {
		var pev = playentevents[pei];
		//updatePresentEvent(pev);
		newheight = newheight + pev.find('.peevblock')[0].height() + playenteventgap;
	}

	if (newheight < viewheight) { newheight = viewheight; }

	viewheight = newheight;

	for (var swi = 0; swi < views.length; swi++) {
		var swline = views[swi];
		swline.x((swi * (viewwidth + viewgap)) + viewXoffset + evbutspacewidth)
		swline.find('.viewblock').height(newheight);
	}

	prstageh = (viewYoffset * 2) + newheight + viewtextspace + prmargin;
	playstage.height(prstageh);
}


function makeView(state) {
	var viewindex = views.length;
	var viewobj = new Konva.Group({
		name: 'view',
		draggable: false,
		x: (viewindex * (viewwidth + viewgap)) + viewXoffset + evbutspacewidth,
		y: viewYoffset,
		width: viewwidth,
		height: viewheight + viewtextspace
	});


	var viewblock = new Konva.Rect({
		name: 'viewblock',
		draggable: false,
		x: 0,
		y: viewtextspace,
		width: viewwidth,
		height: viewheight,
		cornerRadius: 5,
		fill: viewnonselcol,
		stroke: 'black',
		strokeWidth: 1
	});

	var nameobj = new Konva.Text({
		name: 'viewname',
		draggable: false,
		x: 0,
		y: 0,
		text: state.name,
		fontSize: 12,
		fill: 'black'
	});

	viewobj.add(viewblock);
	viewobj.add(nameobj);
	playlayer.add(viewobj);
	viewobj.moveToBottom();
	nameobj.moveToTop();
	playlayer.draw();

	viewobj.on('mousedown', function () {
		if (mousedown_action == false) {
			activeviewobj = this;

			var vchildren = playlayer.getChildren().toArray();
			for (var i = 0; i < vchildren.length; i++) {
				var selobj = vchildren[i];
				if (activeviewobj == selobj) {
					selobj.find('.viewblock').fill(viewselectcol);
				}
				else {
					selobj.find('.viewblock').fill(viewnonselcol);
				}

			}
			playlayer.draw();
		}
		else {
			mousedown_action = false;
		}
		//updateViewPropDisp();

	});

	viewobj.setAttr('state', state);
	return viewobj;
}

function createPEandViews(peinfo) {
	screenwidth = peinfo.screenwidth;
	screenheight = peinfo.screenheight;
	txscale = peinfo.txscale;
	var evlists = peinfo.pestates;
	snapshots = peinfo.layersnapshots;
	playlayer.destroyChildren();
	playstage.clear();

	// get views from first entry
	if (evlists.length > 0) {
		var pestate = evlists[0];
		var peviews = pestate.peviews;
		for (var vi = 0; vi < peviews.length; vi++) {
			var view = makeView(peviews[vi].viewstate);
			views.push(view);
			viewNames.push(peviews[vi].viewstate.name);
		}
		//makeStartEvent(snapshots[0]);
		// make PEs
		for (var pei = 0; pei < evlists.length; pei++) {
			pestate = evlists[pei];
			makePresentEvent(pestate);
		}

		playlayer.draw();
		openingProject = false;
	}

	createViewLinks();
}


function createViewLinks() {

	if (viewNames.length == 0 || $('#views').length == 0) {
		return;
	}

	var icon = $('<i class="fa fa-fw fa-external-link"></i>');
	icon.css('margin', '0 .2em');

	var allLink = $('<a class="pure-button button-min">');
	allLink.attr({
		href: 'javascript:;',
	});
	allLink.text('Open all');
	allLink.append(icon.clone());
	allLink.on('click', function() {
		$(this).siblings('.view-link').each(function() {
			window.open($(this).attr('href'), '_blank');
		});
	});

	$('#views').append(allLink);

	for (var i = 0; i < viewNames.length; i++) {

		var viewLink = $('<a class="pure-button button-secondary button-min view-link">');
		viewLink.attr({
			href: serverurl + '/' + viewNames[i] + '.html',
			target: '_blank',
		});
		viewLink.css('margin-left', '.5em');
		viewLink.text(viewNames[i]);
		viewLink.append(icon.clone());

		$('#views').append(viewLink);

	}


}

/**
 * On load: build a list of audio objects and initialise the Howl sound player objects.
 *
 */
function soundSetup(peinfo) {

	var snapshots = peinfo.layersnapshots;
	for (var snapIdx = 0; snapIdx < snapshots.length; snapIdx++) {
		var snap = snapshots[snapIdx];
		for (var layerIdx = 0; layerIdx < snap.length; layerIdx++) {
			var objs = snap[layerIdx].objstates;
			for (var objIdx = 0; objIdx < objs.length; objIdx++) {
				var obj = objs[objIdx];
				if (obj.type == 'Audio' && ! sounds.hasOwnProperty(obj.id)) {
					sounds[obj.id] = new Howl({
						src: ["/" + obj.src]
					});
				}
			}
		}
	}

}


function keysSetup() {

	$(document).on('keydown', function(e) {
		switch (e.keyCode) {
			case keys.ENTER:
			case keys.RIGHT:
			case keys.PGDN:
				e.preventDefault();
				gonextEvent();
			break;
			case keys.LEFT:
			case keys.PGUP:
				e.preventDefault();
				goprevEvent();
			break;
		}
	});

}



function togFullscreen() {
	/**
	* Toggle full screen mode
	*/
	var element = document.documentElement;

	if (fullscreen == false) {
		// These function will not exist in the browsers that don't support fullscreen mode yet,
		// so we'll have to check to see if they're available before calling them.
		if (element.RequestFullScreen) {
			element.RequestFullScreen();
			fullscreen = true;
		}
		else if (element.mozRequestFullScreen) {
			element.mozRequestFullScreen();  //Mozilla
			fullscreen = true;
		}
		else if (element.webkitRequestFullScreen) {
			element.webkitRequestFullScreen();  //Chrome, Safari
			fullscreen = true;
		}
	}
	else {
		if (document.cancelFullScreen) {
			document.cancelFullScreen();
			fullscreen = false;
		}
		else if (document.mozCancelFullScreen) {
			document.mozCancelFullScreen();
			fullscreen = false;
		}
		else if (document.webkitCancelFullScreen) {
			document.webkitCancelFullScreen();
			fullscreen = false;
		}
	}


}


function screenSetup() {
	/**
	* Set up the various panels in the screen according to the screen mode and size
	*/
	var ww = $(window).width();
	var wh = $(window).height();
	// $('#page').css({ 'height': Math.round(0.98 * wh).toString() + 'px' });
	// $('#page').css({ 'width': Math.round(0.98 * ww).toString() + 'px' });
	var ph = $('#page').height();
	var pw = $('#page').width();
	var fh = $('#functionbox').height();
	// $('#playspace').css({ 'height': Math.round(ph - fh - 10).toString() + 'px' });
	$("body").css({ "padding-top": (fh * 1.2) + "px", "padding-bottom": fh + "px" });
	prh = $('#playspace').height();
	prw = $('#playspace').width();

}

function resizeStages() {
}

function gonextEvent() {
	var peevindex = playentevents.indexOf(activepeevobj);
	peevindex = peevindex + 1;
	if (peevindex == playentevents.length) {
		if (loopmode) {
			// End of list
			peevindex = 0;
		} else {
			return;
		}
	}

	var peev = playentevents[peevindex];
	peev.fire('mousedown');

}

function goprevEvent() {
	var peevindex = playentevents.indexOf(activepeevobj);
	peevindex = peevindex - 1;
	if (peevindex == playentevents.length || peevindex < 0) { peevindex = 0; }
	var peev = playentevents[peevindex];
	peev.fire('mousedown');

}

function txplayEventtoScreens(peobj) {
	//message to screens to play event
	var ind = playentevents.indexOf(peobj);
	// console.log(peobj);
	//message to screen to play
	var pevstate = peobj.getAttr('state');
	for (var pei = 0; pei < pevstate.peviews.length; pei++) {
		var peview = pevstate.peviews[pei];
		var scrname = peview.viewstate.name;
		var layerid = peview.layerid;
		if (layerid != 'none' && peview.actions.length > 0) {
			var scrcommand = { view: scrname, scrtxmsg: { command: 'play', info: '' } };
			var scrjson = JSON.stringify(scrcommand);
			socket.emit('screenmsg', scrjson);
		}
	}

	if (audiodev === 'local') {
		var snapstate = snapshots[ind];
		var actions = snapstate[0].layeractions;
		for (var actIdx = 0; actIdx < actions.length; actIdx++) {
			var action = actions[actIdx];
			// Audio actions?
			if (action.actiontype == 'audio_play' || action.actiontype == 'audio_stop') {
				// Got sound for this ID?
				if (sounds.hasOwnProperty(action.parentobjectid)) {
					switch (action.actiontype) {
						case 'audio_play':
							sounds[action.parentobjectid].play();
						break;
						case 'audio_stop':
							sounds[action.parentobjectid].stop();
						break;
					}
				}
			}
		}
		// console.log(actions);
	}
}

function txstartEventtoScreens(peobj) {
	//message to screens to go to startstate
	var ind = playentevents.indexOf(peobj);
	//message to screen to go to startstate
	var pevstate = peobj.getAttr('state');
	for (var pei = 0; pei < pevstate.peviews.length; pei++) {
		var peview = pevstate.peviews[pei];
		var scrname = peview.viewstate.name;
		var layerid = peview.layerid;
		if (layerid != 'none' && peview.actions.length > 0) {
			var scrcommand = { view: scrname, scrtxmsg: { command: 'start', info: '' } };
			var scrjson = JSON.stringify(scrcommand);
			socket.emit('screenmsg', scrjson);
		}
	}
}

function findPeviewLayer(layerid, snapshotlayers) {
	/**
	* to find a layer in a snapshot list
	*/
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


function txstartStatetoScreens(peobj) {
	//message to screens to go to startstate of event
	var ind = playentevents.indexOf(peobj);
	var pevstate = peobj.getAttr('state');
	var snapstate = snapshots[ind];
	//console.log(snapshots);
	for (var pei = 0; pei < pevstate.peviews.length; pei++) {
		var peview = pevstate.peviews[pei];
		var scrname = peview.viewstate.name;
		var layerid = peview.layerid;
		//console.log(layerid);
		if (layerid != 'none') {
			layerind = findPeviewLayer(layerid, snapstate);
			var screenstate = { screenwidth: screenwidth, screenheight: screenheight, txscale: txscale, viewstate: peview.viewstate, layerchildren: snapstate[layerind].objstates, layeractions: snapstate[layerind].layeractions };
			var scrcommand = { view: scrname, scrtxmsg: { command: 'update', info: screenstate } };
			//console.log(scrcommand);
			var scrjson = JSON.stringify(scrcommand);
			socket.emit('screenmsg', scrjson);
		}
	}
}


function txClickEvent(eventId) {

	var eventIdx = findEventById(eventId);
	if (eventIdx == playentevents.length) { eventIdx = 0; }

	var peev = playentevents[eventIdx];
	var prev_playmode = playmode;
	playmode = true;
	peev.fire('mousedown');
	playmode = prev_playmode;

	//txstartStatetoScreens(activepeevobj);
	// setTimeout(function () { txplayEventtoScreens(activepeevobj); }, 200);
}


function txAudioDevice() {
	for (var idx = 0; idx < views.length; idx++) {
		var viewstate = views[idx].getAttr('state');
		var scrcommand = {
			view: viewstate.name,
			scrtxmsg: {
				command: "audiodev",
				info: audiodev
			}
		}
		var scrjson = JSON.stringify(scrcommand);
		socket.emit('screenmsg', scrjson);
	}
}


function findEventById(eventId) {
	var indexes = $.map(playentevents, function(obj, idx) {
		var state = obj.getAttr("state");
		if (state.id == eventId) {
			return idx;
		}
	});
	return indexes[0];
}


function ioUpdate(respdata) {
	var viewcommand = JSON.parse(respdata);
	var command = viewcommand.command;

	//console.log(command);
	switch (command) {
		case "clickEvent":
			txClickEvent(viewcommand.info);
		break;


		/*			case 'designready':
						var msg = viewcommand.info;
						if (msg == 'openready'){
							designready = true;
							$('#createpebutton').prop('disabled',false);
							$('#createviewbutton').prop('disabled',false);
							txPEventsGetPEInfo();
						}
						else if (msg == 'newready'){
							designready = true;
							$('#createpebutton').prop('disabled',false);
							$('#createviewbutton').prop('disabled',false);
							makeStartEvent([]);
							txPEventsGetLayerInfo();
						}
						else {
							designready = false;
							alert('Designscreen is not ready');
						}
					break;

					*/
	}

}


function setPlaymode() {
	var checkbox = $("#playaction");
	if (checkbox.length === 0) {
		checkbox = $("#functionbox input[type=checkbox]:first");
	}
	playmode = checkbox.prop('checked');
}


function setLoopMode() {
	var checkbox = $("#loopmode");
	if (checkbox.length === 0) {
		checkbox = $("#functionbox input[type=checkbox][name='loop']:first");
	}
	loopmode = checkbox.prop('checked');
}


function setAudioDevice() {
	audiodev = $("[name='audio_device']:checked").val();
	txAudioDevice();
}


function setup() {
	/**
	* Initial set up
	*/
	if (USEIO) {
		socket = io(serverurl);
		socket.on('updateEvents', function(respdata) {
			ioUpdate(respdata);
		});
	}

	playstage = new Konva.Stage({
		container: playspace,
		name: 'playscreen',
		width: prstagew,
		height: prstageh
	});
	playlayer = new Konva.Layer({ name: "playlayer" });
	playstage.add(playlayer);
	playlayer.draw();




	document.addEventListener("fullscreenchange", function () {
		screenSetup();
		resizeStages();
	}, false);

	document.addEventListener("mozfullscreenchange", function () {
		screenSetup();
		resizeStages();
	}, false);

	document.addEventListener("webkitfullscreenchange", function () {
		screenSetup();
		resizeStages();
	}, false);

	screenSetup();
	soundSetup(peinfo);
	keysSetup();
	$('#playaction').prop('checked', playmode);
	$('#loopmode').prop('checked', loopmode);
	createPEandViews(peinfo);

}
