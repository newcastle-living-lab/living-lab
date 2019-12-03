
var USEIO = true;
var screenstage = null;
var screenlayer = null;
var sw, sh;
var socket = null;
var ioqueue = [];
var screenIdTimeout = null;
var screenDims = { width: 1000, height: 1000 };
var isPlaying = false;
// Default audio playback will be local playlist. 'screen' if this should be responsible for playing.
var audiodev = "local";

//var serverurl = 'http://127.0.0.1:1337';
var serverurl = [window.location.protocol, '//', window.location.hostname, ':', window.location.port].join('').replace(/:$/, '')

var screenanimlist = new Array();

var screenscaling = 1.0;

function initScreen() {

	screenstage = new Konva.Stage({
		container: "container",
		width: 0,
		height: 0
	});

	screenlayer = new Konva.Layer({ name: 'screenlayer' });

	screenstage.on('setupdone', function () { processNextio('setupdone'); });
	screenstage.on('startdone', function () { processNextio('startdone'); });

	screenstage.on('playdone', function () {
		isPlaying = false;
		processNextio('playdone');
	});

	addLayerAnimation(screenlayer);
	screenstage.add(screenlayer);

	showScreenIdentifier(5);

	scaleScreen();

}


var showScreenIdentifier = function(len) {
	var $container = $("<div class='screen-identifier'>");

	var screenLabel = window.screen_name;

	// Check if the screen name is namespaced (player:project:view)
	// If it is, just get the last part
	if (window.screen_name.match(/:/)) {
		var items = window.screen_name.split(':');
		screenLabel = items[items.length-1];
	}

	var $span = $("<span>").text(screenLabel);
	$span.appendTo($container);
	$container.appendTo($("body"));

	clearTimeout(screenIdTimeout);

	screenIdTimeout = setTimeout(function() {
		closeScreenIdentifier();
	}, (parseInt(len, 10) * 1000));
}


var closeScreenIdentifier = function() {
	$(".screen-identifier").fadeOut("slow", function() {
		$(".screen-identifier").remove();

	});
}


function addLayerAnimation(animlayer) {

	var anim = new Konva.Animation(function(frame) {

		var stopflag = true;

		for (var i = 0; i < screenanimlist.length; i++) {

			var action = screenanimlist[i];
			if (action.targetType == 'audio' || action.targetType == 'url') {
				// Skip audio
				continue;
			}

			var prop = action.interpolateProp(frame);
			var obj = action.parentobject;
			obj.setAttr(action.property, prop);

			if ((frame.time - action.starttime * 1000) > action.animDuration * 1000) {
				stopflag = stopflag && true;   //if many objects wait until last one is finished
			} else {
				stopflag = stopflag && false;
			}
		}

		if (stopflag == true) {
			this.stop();
			frame.time = 0.0;
			screenstage.fire('playdone');
		}

	}, animlayer);

	animlayer.setAttr('animation', anim);
}


function setupEvents(obj) {

	var eventId = obj.getAttr("event");
	var hasEvent = (obj && eventId !== undefined && eventId.length);
	if ( ! hasEvent) {
		return;
	}

	obj.on('mouseover', function() {
		document.body.style.cursor = 'pointer';
		// cursorstate = 'onobj';
	});

	obj.on('mouseout', function() {
		document.body.style.cursor = 'default';
		// cursorstate = 'free';
	});

	obj.on('mousedown', function() {
		// On click: ask the parent screen (Design or Playlist) to trigger the event by ID
		var msg = {
			project: (window.project ? window.project.slug : null),
			command: 'clickEvent',
			info: this.getAttr("event"),
			src: this.getAttr("id")
		};
		// console.log(msg);
		socket.emit("updateEvents", JSON.stringify(msg));
	});
}


function scaleScreen() {

	// Set the width/height of the stage container
	var hwratio = screenDims.height / screenDims.width;
	var vh = $(".page").height();
	var vw = $(".page").width();
	var vhwratio = vh / vw;
	if (vhwratio > hwratio) {
		var stw = vw;
		var sth = Math.round(vw * hwratio);
	} else {
		var sth = vh;
		var stw = Math.round(vh / hwratio);
	}

	$('#container').height(sth);
	$('#container').width(stw);
	screenstage.width(stw);
	screenstage.height(sth);
	// txscale = project.screenwidth / stw;

	var ratio = 0,
		maxWidth = stw,
		maxHeight = sth,
		width = screenDims.width,
		height = screenDims.height;

	if (width > maxWidth) {
		ratio = maxWidth / width;
		var newWidth = maxWidth;
		var newHeight = height * ratio;
		screenstage.width(newWidth);
		screenstage.height(newHeight);
		height = height * ratio;
		width = width * ratio;
	}

	if (height > maxHeight) {
		ratio = maxHeight / height;
		var newHeight = maxHeight;
		var newWidth = width * ratio;
		screenstage.width(newWidth);
		screenstage.height(newHeight);
		width = width * ratio;
	}

	if (ratio === 0) {
		// No scaling *down* required
		var scale = {
			x: stw / screenDims.width,
			y: sth / screenDims.height
		};
	} else {
		// scale down to the calculated sizes
		var scale = {
			x: newWidth / screenDims.width,
			y: newHeight / screenDims.height
		};
	}

	screenstage.scale(scale);
	screenstage.draw();
}


function makeScreen(screenstate) {

	console.log("makeScreen");
	// console.log(screenstate);

	// Grab the project screen size - store in vars for use by `scaleScreen()`
	screenDims.width = screenstate.screenwidth;
	screenDims.height = screenstate.screenheight;

	screenstage.clear();
	screenlayer.destroyChildren();

	scaleScreen();

	screenstate.container = 'container';

	// screenscaling = 1.0;

	//console.log(screenstate);

	var objects = screenstate.layerchildren;
	//console.log(objects);
	for (var k = 0; k < objects.length; k++) {
		var objstate = objects[k];
		// console.log(objstate);
		if (objstate.type == 'Group') {
			var obj = newgroupobj(false, false, objstate);
			obj.x(objstate.x);
			obj.y(objstate.y);
			// obj.scale({ x: screenscaling, y: screenscaling });
			screenlayer.add(obj);
			setupEvents(obj);
			//console.log('added group');
		} else {
			var obj = newobj(false, objstate);
			obj.x(objstate.x);
			obj.y(objstate.y);
			// obj.scale({ x: screenscaling, y: screenscaling });
			screenlayer.add(obj);
			//console.log('added obj');

			setupEvents(obj);
		}
		// if (objstate && objstate.event) {
		// 	console.log("Found click event on:");
		// 	console.log(objstate);
		// }
	}
	//add actions for the layer
	//actions are added to the layer actionlist from where they are called using their id
	var actions = screenstate.layeractions;
	// console.log("actions");
	// console.log(actions);
	var actionlist = new Array();
	for (var m = 0; m < actions.length; m++) {
		var actionstate = actions[m];
		var parentobject = screenlayer.find('#' + actionstate.parentobjectid)[0];
		actionstate.parentobject = parentobject;
		//console.log(actionstate);
		if (actionstate.actiontype == 'move') {
			var ss = actionstate.startstate;
			var es = actionstate.endstate;
			//console.log(ss,es);
			actionstate.startstate = { x: ss.x * screenscaling, y: ss.y * screenscaling };
			actionstate.endstate = { x: es.x * screenscaling, y: es.y * screenscaling };
			//console.log(actionstate.startstate,actionstate.endstate);
		}
		var action = new Action(actionstate.parentobject, actionstate.id, actionstate.actiontype, actionstate.startstate, actionstate.endstate, actionstate.starttime, actionstate.duration);
		actionlist.push(action);
	}
	//console.log(actionlist);
	screenlayer.setAttr('actionlist', actionlist);
	screenlayer.draw();
	screenstage.fire('setupdone');
}


/**
*finds all actions acting on the object
*/
function findObjActions(obj) {
	var objactions = [];
	var actions = screenlayer.getAttr('actionlist');
	for (var ai = 0; ai < actions.length; ai++) {
		var act = actions[ai];
		if (obj.id() == act.parentobject.id()) {
			objactions.push(act);
		}
	}
	return objactions;
}


function setObjstoStartstate() {

	var objs = screenlayer.getChildren();
	for (var ch = 0; ch < objs.length; ch++) {
		var obj = objs[ch];
		var acts = findObjActions(obj);
		//arrange into property bins
		var bins = {};
		for (var ai = 0; ai < acts.length; ai++) {
			var acttype = acts[ai].actiontype;
			var bintype = bins[acttype];
			if (bintype == null) {
				bins[acttype] = [acts[ai]];
			}
			else {
				bintype.push(acts[ai]);
			}
		}
		var firstactions = [];
		//find earliest starttime for each actiontype and set startstate to that
		for (var key in bins) {
			var acttyplist = bins[key];
			var sttime = 10000.0;
			for (var i = 0; i < acttyplist.length; i++) {
				if (acttyplist[i].starttime < sttime) {
					sttime = acttyplist[i].starttime;
					var shortindex = i;
				}
			}
			(acttyplist[shortindex]).settoStartstate();
			firstactions.push(acttyplist[shortindex]);
			//console.log(obj.getType(),key,acttyplist[shortindex].property,obj.getAttr(acttyplist[shortindex].property));
		}
		if (firstactions.length > 0) {
			//now find earliest of all actions and setstart in case opacity and appear conflict
			var sttime = 10000.0;
			for (var j = 0; j < firstactions.length; j++) {
				if (firstactions[j].starttime < sttime) {
					sttime = firstactions[j].starttime;
					var shortindex = j;
				}
			}
			(firstactions[shortindex]).settoStartstate();
			screenlayer.draw();
		}
	}
	screenstage.fire('startdone');
}


/**
 * Plays actions as cast to the screen
 *
 */
function play() {
	isPlaying = true;
	screenanimlist = screenlayer.getAttr('actionlist');
	// console.log(screenanimlist);
	var anim = screenlayer.getAttr('animation');
	screenlayer.draw();
	anim.start();

	for (var i = 0; i < screenanimlist.length; i++) {
		var action = screenanimlist[i];
		var id = action.parentobject.getAttr('id');

		console.log(action);

		switch (action.actiontype) {
			case 'audio_play':
				if (audiodev === 'screen') {
					audioAction('play', id, action.src);
				}
			break;

			case 'audio_stop':
				if (audiodev === 'screen') {
					audioAction('stop', id, action.src);
				}
			break;

			case 'url_open':
				urlAction('open', id, action.url);
			break;

			case 'url_close':
				urlAction('close', id, action.url);
			break;
		}

	}

}


function selectLayer(layername) {
	screenstage.clear();
	screenlayer = screenstage.find('.' + layername)[0];
	screenlayer.draw();
	//console.log(screenlayer);
}


function ioUpdate(respdata) {
	//console.log(respdata);
	var viewcommand = JSON.parse(respdata);
	var command = viewcommand.command;

	console.log(command);
	switch (command) {
		case 'update':
			var viewstate = viewcommand.info;
			makeScreen(viewstate);
			break;

		case 'start':
			setObjstoStartstate();

			break;

		case 'play':
			play();
			break;

		case 'audiodev':
			audiodev = viewcommand.info;
			// console.log("Setting audio playback device to " + viewcommand.info);
			break;

	}

}

function processNextio(ev) {
	if (ioqueue.length > 0 && ! isPlaying) {
		var msg = ioqueue.shift();
		ioUpdate(msg);
	}
}

$(document).ready(function () {

	initScreen();

	$("body").on("click", ".screen-identifier", function() {
		closeScreenIdentifier();
	});

	$(document).one("click", function() {
		$(".audio-enabler").hide();
	});

	window.onresize = function(){
		scaleScreen();
	}

	if (USEIO) {
		socket = io(serverurl);

		socket.on("ident:show", function() {
			showScreenIdentifier(5);
		});

		socket.on(socketmessage, function(respdata) {
			$(".audio-enabler").hide();
			if (ioqueue.length == 0) {
				ioqueue.push(respdata);
				processNextio('incoming');
			} else {
				ioqueue.push(respdata);
			}
		});

	}

});
