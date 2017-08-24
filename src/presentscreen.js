USEIO = true;
var socket;
var serverurl = 'http://' + window.location.hostname + ':' + window.location.port;
var fullscreen = false;
var maxviews = 4;
var prw, prh;
var presstage, preslayer;
var evbutspacewidth = 150;
var views = []; //list of viewobjects with state attributes linked to physical screens/browserpages
var layers = []; //list of {layerid:id,layername:name} in designscreen
var viewnonselcol = '#ddddee';
var viewselectcol = '#ccddee';
var viewwidth = 150;
var viewgap = 30;
var viewheight = 300;
var viewtextspace = 15;
var viewXoffset = 50;
var viewYoffset = 30;
var presenteventoffset = 25;
var presenteventgap = 5;
var prmargin = 5;
var prstagew = evbutspacewidth + viewXoffset + maxviews * viewwidth + (maxviews - 1) * viewgap + 2 * prmargin;
var prstageh = viewYoffset + viewheight + viewtextspace + prmargin;
var presentevents = []; //array of present event objects
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
var openingProject = false;
var playmode = false;
var sspeevnonselcol = '#ccddcc';
var sspeevselectcol = '#aaaaff';



function updateViewState(prop) {
	/**
	 * Updates the state attribute of the presentevent
	 */
	var propkey = Object.keys(prop)[0];
	var propval = prop[propkey];
	//console.log(propkey,propval);
	var state = activeviewobj.getAttr('state');
	state[propkey] = propval;

	if (propkey == 'name') {
		activeviewobj.find('.viewname')[0].text(propval);
	}

	var vindex = views.indexOf(activeviewobj);
	if (vindex > -1) {
		for (var i = 0; i < presentevents.length; i++) {
			pestate = presentevents[i].getAttr('state');
			(pestate.peviews[vindex]).viewstate.name = propval;
		}
	}
	txPEventsArr();

	preslayer.draw();
}

function updateViewPropDisp() {

	/**
	 *Updates the displayed properties of the presentevent
	 */
	var state = activeviewobj.getAttr('state');

	//make table to display
	$("#proptable").empty();
	for (var key in state) {
		if (key != 'peviews' && key != 'id') {
			var propval = state[key];
			if (key == 'type') {
				$("#proptable").append('<tr><td class="tablekey">' + key + '</td><td class="tableval" style="text-align:left">' + propval + '</td></tr>');

			} else {
				if (isNaN(propval)) {
					$("#proptable").append('<tr><td class="tablekey">' + key + '</td><td class="tableval"><input id="prop' + key + '" type="text" style="text-align:left" size="10" onchange="updateViewState({' + key + ':this.value})"></td></tr>');
				} else {
					$("#proptable").append('<tr><td class="tablekey">' + key + '</td><td class="tableval"><input id="prop' + key + '" type="text" style="text-align:right" size="10" onchange="updateViewState({' + key + ':checkInput(this.value)})"></td></tr>');
				}
				var el = document.getElementById("prop" + key);
				if (isNaN(propval)) {
					$("#prop" + key).val(propval);
				} else {
					var num = parseFloat(propval);
					if ((num % 1) == 0.0) {
						$("#prop" + key).val(propval.toFixed(0));
					} else {
						$("#prop" + key).val(propval.toFixed(2));
					}
				}
			}
		}
	}
}


function updatePElayer(viewindex, newlayerindex) {
	var state = activepeevobj.getAttr('state');
	var peview = state.peviews[viewindex];
	peview.layerid = layers[newlayerindex].layerid;
	peview.layername = layers[newlayerindex].layername;
}

function updatePEState(prop) {
	/**
	 * Updates the state attribute of the presentevent
	 */
	var propkey = Object.keys(prop)[0];
	var propval = prop[propkey];
	//console.log(propkey,propval);
	var state = activepeevobj.getAttr('state');

	if (propkey == 'name' && propval != 'startevent') {
		activepeevobj.find('.peevname')[0].text(propval);
		state[propkey] = propval;
	} else if (propkey.slice(0, 7) == 'peviews') {
		var viewindex = parseInt(propkey.slice(7));
		var newlayerindex = parseInt(propval);
		//console.log(viewindex,newlayerindex);
		updatePElayer(viewindex, newlayerindex);
	}
	txPEventsArr();

	preslayer.draw();
}

function updatePEpropDisp() {
	/**
	 *Updates the displayed properties of the presentevent
	 */
console.log("updatePEpropDisp");
console.log(activepeevobj);
	if (activepeevobj != null) {
		var state = activepeevobj.getAttr('state');
		//make table to display
		$("#proptable").empty();
		for (var key in state) {
			if (key != 'actiontype' && key != 'index' && key != 'id') {
				var propval = state[key];
				if (key == 'name' && propval == 'startevent') {
					$("#proptable").append('<tr><td class="tablekey">' + key + '</td><td class="tableval" style="text-align:left">' + propval + '</td></tr>');
				} else if (key == 'peviews') {
					var htmlstr = '';
					for (var li = 0; li < layers.length; li++) {
						var lrname = layers[li].layername;
						htmlstr = htmlstr + '<option value="' + lrname + '">' + lrname + '</option>';
					}
					var pevarr = propval;
					$("#proptable").append('<tr><td class="tablekey">View</td><td class="tableval" style="text-align:left">Layer</td></tr>');
					for (var vi = 0; vi < views.length; vi++) {
						var viewname = views[vi].getAttr('state').name;
						var layerinfo = pevarr[vi];
						$("#proptable").append('<tr><td class="tablekey">' + viewname + '</td><td class="tableval"><select id="prop' + key + vi.toFixed(0) + '" class="layerselect" size="1" onchange="updatePEState({' + key + vi.toFixed(0) + ':this.selectedIndex})"></select></td></tr>');
						$('#prop' + key + vi.toFixed(0)).empty();
						$('#prop' + key + vi.toFixed(0)).append(htmlstr);
						$('#prop' + key + vi.toFixed(0)).val(layerinfo.layername);
					}

				} else {
					if (isNaN(propval)) {
						$("#proptable").append('<tr><td class="tablekey">' + key + '</td><td class="tableval"><input id="prop' + key + '" type="text" style="text-align:left" size="10" onchange="updatePEState({' + key + ':this.value})"></td></tr>');
					} else {
						$("#proptable").append('<tr><td class="tablekey">' + key + '</td><td class="tableval"><input id="prop' + key + '" type="text" style="text-align:right" size="10" onchange="updatePEState({' + key + ':checkInput(this.value)})"></td></tr>');
					}
					var el = document.getElementById("prop" + key);
					if (isNaN(propval)) {
						$("#prop" + key).val(propval);
					} else {
						var num = parseFloat(propval);
						if ((num % 1) == 0.0) {
							$("#prop" + key).val(propval.toFixed(0));
						} else {
							$("#prop" + key).val(propval.toFixed(2));
						}
					}
				}
			}
		}
	}
}



function clearProps() {
	/**
	 * Clears the property table panel
	 */
	$('#proptable').empty();
}


function enableDesignButtons() {
	/**
	 * Manage the activation of the buttons above the design space
	 */
	if (presentevents.length > 0) {
		$('#deletepebutton').prop('disabled', false);
	} else {
		$('#deletepebutton').prop('disabled', true);
	}

	$('#createpebutton').prop('disabled', false);
	$('#txscrbutton').prop('disabled', false);
}

function disableDesignButtons() {
	/**
	 * Disable all the design buttons
	 */
	$('#deletepebutton').prop('disabled', true);
	$('#txscrbutton').prop('disabled', false);
	$('#createpebutton').prop('disabled', true);
}

function updateallPEventActions(PEstatesarray) {
	for (var i = 0; i < PEstatesarray.length; i++) {
		var pestate = PEstatesarray[i];
		var pev = preslayer.find('#' + pestate.id)[0];
		var pevstate = pev.getAttr('state');
		//console.log(pevstate);
		pevstate.peviews = pestate.peviews;
		updatePresentEvent(pev);

	}

}


function delPresentEvent() {
	if (activepeevobj != null) {
		var ans = confirm('Are you sure you want to delete this event?');
		if (ans == true) {
			var delind = presentevents.indexOf(activepeevobj);
			if (delind > -1) {
				presentevents.splice(delind, 1);
				activepeevobj.destroyChildren();
				activepeevobj.destroy();
				for (var i = 0; i < presentevents.length; i++) {
					var preevstate = presentevents[i].getAttr('state');
					preevstate.index = i;
				}
				updateViews();
				txPEventsDelete(delind);
				if (presentevents.length > 0) {
					$('#deletepebutton').prop('disabled', false);
				} else {
					$('#deletepebutton').prop('disabled', true);
				}

			}
		}
	}
}


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
		if (nac > numactions) {
			numactions = nac;
		}
		for (var ai = 0; ai < actions.length; ai++) {
			var actstate = actions[ai];
			var actobj = new Kinetic.Text({
				name: 'actionname',
				draggable: false,
				x: (i * (viewwidth + viewgap)) + viewXoffset + evbutspacewidth + 3, //align with view
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


	var yoffset = viewYoffset + presenteventoffset + peevobjh + presenteventgap;
	for (var j = 0; j < pevstate.index; j++) {
		var pevnt = presentevents[j];
		var block = pevnt.find('.peevblock')[0];
		yoffset = yoffset + block.height() + presenteventgap;
	}
	pev.y(yoffset);
	preslayer.draw();

}

function newPresentEvent() {
	var ind = presentevents.length;
	var peviewarr = [];
	var pestate = {
		name: 'event',
		index: ind,
		id: UniqueId(),
		actiontype: 'Eventlist'
	};
	for (var i = 0; i < views.length; i++) {
		var peview = {
			id: UniqueId(),
			parentid: pestate.id,
			viewstate: views[i].getAttr('state'),
			layerid: 'none',
			layername: 'none',
			actions: []
		};
		peviewarr.push(peview);
	}

	pestate.peviews = peviewarr;
	var newPE = makePresentEvent(pestate);
	return newPE;
}

function makePresentEvent(state) {

	var peevobj = new Kinetic.Group({
		name: 'presentevent',
		draggable: true,
		id: state.id,
		x: prmargin,
		y: viewYoffset,
		width: peevobjw + evbutspacewidth + viewXoffset,
		height: peevobjh
	});

	peevobj.setAttr('state', state);

	var peevblock = new Kinetic.Rect({
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


	var nameobj = new Kinetic.Text({
		name: 'peevname',
		draggable: false,
		x: 5,
		y: 5,
		text: state.name,
		fontSize: 12,
		fill: 'black'

	});

	var startbutton = new Kinetic.RegularPolygon({
		x: 150,
		y: 15,
		draggable: false,
		sides: 3,
		radius: 10,
		rotation: -90,
		fill: '#000'
	});

	var playbutton = new Kinetic.RegularPolygon({
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


	preslayer.add(peevobj);
	//peevobj.moveToBottom();
	//preslayer.draw();

	startbutton.on('mouseover', function() {
		document.body.style.cursor = 'pointer';
		cursorstate = 'onpeev';
	});

	startbutton.on('mouseout', function() {
		document.body.style.cursor = 'default';
		cursorstate = 'free';
	});


	startbutton.on('mousedown', function() {
		//this.fill('#ff5555');
		mousedown_action = true;
		if (activepeevobj == this.getParent()) {
			txstartEvent(activepeevobj);
		}


	});

	playbutton.on('mouseover', function() {
		document.body.style.cursor = 'pointer';
		cursorstate = 'onpeev';
	});

	playbutton.on('mouseout', function() {
		document.body.style.cursor = 'default';
		cursorstate = 'free';
	});

	playbutton.on('mousedown', function() {
		//this.fill('#ff5555');
		mousedown_action = true;
		if (activepeevobj == this.getParent()) {
			txplayEvent(activepeevobj);
		}


	});

	peevobj.on('mousedown', function() {
		if (mousedown_action == false) {
			activepeevobj = this;
			//mousedown_action = true;
			var pechildren = preslayer.getChildren().toArray();
			for (var i = 0; i < pechildren.length; i++) {
				var selobj = pechildren[i];
				if (activepeevobj == selobj) {
					selobj.find('.peevblock').fill(peevselectcol);
				} else {
					selobj.find('.peevblock').fill(peevnonselcol);
				}

			}
			preslayer.draw();
			castPresentEvent();

			if (playmode == true) {
				setTimeout(function() {
					txplayEvent(activepeevobj);
				}, 200);
			}

		} else {
			mousedown_action = false;
		}

		updatePEpropDisp();

	});

	peevobj.on('dragend', function(e) {
		var ypos = this.y();
		var pei = 0;
		var indx = (this.getAttr('state')).index;
		var pl = presentevents.length;
		while ((pei < pl) && (ypos >= presentevents[pei].y())) {
			pei = pei + 1;
		}
		presentevents.splice(indx, 1);

		if (pei < indx) {
			presentevents.splice(pei, 0, peevobj);
		} else {
			presentevents.splice(pei - 1, 0, peevobj);
		}
		for (var i = 0; i < pl; i++) {
			var preevstate = presentevents[i].getAttr('state');
			preevstate.index = i;
		}
		this.x(prmargin);
		txPEventsArr();
		updatePresentEvent(this);
		updateViews();
	});

	presentevents.push(peevobj);
	//console.log(presentevents);
	// CR: WHen making present event - it is transmitted immediately.
	// This fn is called when a project is first opened - so skip the transmit in this case.l
	if (openingProject == false) {
		txPEventsArr();
	}
	updatePresentEvent(peevobj);
	updateViews();

	if (presentevents.length > 0) {
		$('#deletepebutton').prop('disabled', false);
	} else {
		$('#deletepebutton').prop('disabled', true);
	}

	return peevobj;
}

function makeStartEvent(peviews) {
	// console.log("makeStartEvent");
	// console.log(peviews);
	var ind = 0;
	var pestate = {
		name: 'startevent',
		index: ind,
		id: UniqueId(),
		actiontype: 'Eventlist'
	};
	if (peviews == null) {
		console.log("peviews is null");
		var peviewarr = [];
		for (var i = 0; i < views.length; i++) {
			var peview = {
				id: UniqueId(),
				parentid: pestate.id,
				viewstate: views[i].getAttr('state'),
				layerid: 'none',
				layername: 'none',
				actions: []
			};
			peviewarr.push(peview);
		}

		pestate.peviews = peviewarr;
	} else {
		pestate.peviews = peviews;
	}

	console.log("makeStartEvent");
	console.log(pestate);

	var peevobj = new Kinetic.Group({
		name: 'startevent',
		draggable: false,
		id: pestate.id,
		x: prmargin,
		y: viewYoffset,
		width: peevobjw + evbutspacewidth + viewXoffset,
		height: peevobjh
	});

	peevobj.setAttr('state', pestate);

	var peevblock = new Kinetic.Rect({
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


	var nameobj = new Kinetic.Text({
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


	preslayer.add(peevobj);


	peevobj.on('mousedown', function() {
		if (mousedown_action == false) {
			activepeevobj = this;
			//mousedown_action = true;
			var pechildren = preslayer.getChildren().toArray();
			for (var i = 0; i < pechildren.length; i++) {
				var selobj = pechildren[i];
				if (activepeevobj == selobj) {
					selobj.find('.peevblock').fill(sspeevselectcol);
				} else {
					selobj.find('.peevblock').fill(sspeevnonselcol);
				}

			}
			preslayer.draw();
			castStartEvent();

		} else {
			mousedown_action = false;
		}

		updatePEpropDisp();

	});

	var yoffset = viewYoffset + presenteventoffset;
	peevobj.y(yoffset);
	preslayer.draw();

	return peevobj;
}


function newView() {

	if (views.length < maxviews) {
		var viewstate = {
			name: 'view'
		};

		//use existing name or give it unique if same
		var namearr = new Array();
		for (var i = 0; i < views.length; i++) {
			var vobj = views[i];
			var vname = vobj.getAttr('state').name;
			console.log(vname);
			namearr.push(vname);
		}
		var nameindex = namearr.indexOf(viewstate.name + '0');
		if (nameindex == -1) { //name not used
			tryname = viewstate.name + '0';
		} else {
			var namenum = 0;
			var same = true;
			while (namenum < 1000 && same) {
				var tryname = viewstate.name + namenum.toString();

				if (namearr.indexOf(tryname) == -1) {
					same = false;
				} else {
					namenum = namenum + 1;
				}
			}
		}
		viewstate.name = tryname;

		var view = makeView(viewstate);
		views.push(view);

		//add view to presentevents peviews and startevent
		var spe = preslayer.find('.startevent')[0];
		if (spe != null) {
			var spestate = spe.getAttr('state');
			spestate.peviews.push({
				viewstate: viewstate,
				layerid: 'none',
				layername: 'none'
			});
		}
		for (var pei = 0; pei < presentevents.length; pei++) {
			var peviewstate = presentevents[pei].getAttr('state');
			peviewstate.peviews.push({
				id: UniqueId(),
				viewstate: viewstate,
				layerid: 'none',
				layername: 'none',
				actions: []
			});
		}
		txPEventsArr();

		for (var vi = 0; vi < views.length; vi++) {
			views[i].moveToBottom();
		}

		if (views.length > 0) {
			$('#deleteviewbutton').prop('disabled', false);
		} else {
			$('#deleteviewbutton').prop('disabled', true);
		}

		if (views.length < maxviews) {
			$('#createviewbutton').prop('disabled', false);
		} else {
			$('#createviewbutton').prop('disabled', true);
		}

	}
}

function delView() {
	if (activeviewobj != null) {
		var ans = confirm('Are you sure you want to delete this view?');
		if (ans == true) {
			var delind = views.indexOf(activeviewobj);
			if (delind > -1) {
				views.splice(delind, 1);
				activeviewobj.destroyChildren();
				activeviewobj.destroy();

				if (views.length > 0) {
					$('#deleteviewbutton').prop('disabled', false);
				} else {
					$('#deleteviewbutton').prop('disabled', true);
				}
				if (views.length < maxviews) {
					$('#createviewbutton').prop('disabled', false);
				} else {
					$('#createviewbutton').prop('disabled', true);
				}
				//remove view from presentevents peviews and startevent
				var spe = preslayer.find('.startevent')[0];
				var spestate = spe.getAttr('state');
				spestate.peviews.splice(delind, 1);
				for (var pei = 0; pei < presentevents.length; pei++) {
					var peviewstate = presentevents[pei].getAttr('state');
					peviewstate.peviews.splice(delind, 1);
				}
				txPEventsArr();

			}
			updateViews();
			preslayer.draw();
		}
	}

}

function updateViews() {
	//	var newheight = presenteventoffset;
	var newheight = presenteventoffset + peevobjh + presenteventgap;
	for (var pei = 0; pei < presentevents.length; pei++) {
		var pev = presentevents[pei];
		//updatePresentEvent(pev);
		newheight = newheight + pev.find('.peevblock')[0].height() + presenteventgap;
	}

	if (newheight < viewheight) {
		newheight = viewheight;
	}

	viewheight = newheight;
	for (var swi = 0; swi < views.length; swi++) {
		var swline = views[swi];
		swline.x((swi * (viewwidth + viewgap)) + viewXoffset + evbutspacewidth)
		swline.find('.viewblock').height(viewheight);
	}

	prstageh = viewYoffset + newheight + viewtextspace + prmargin;
	//console.log(prstageh);
	presstage.height(prstageh);
}


function makeView(state) {
	console.log(views);
	console.log("makeView");
	console.log(state);
	var viewindex = views.length;
	var viewobj = new Kinetic.Group({
		name: 'view',
		draggable: false,
		x: (viewindex * (viewwidth + viewgap)) + viewXoffset + evbutspacewidth,
		y: viewYoffset,
		width: viewwidth,
		height: viewheight + viewtextspace
	});


	var viewblock = new Kinetic.Rect({
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

	var nameobj = new Kinetic.Text({
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
	preslayer.add(viewobj);
	viewobj.moveToBottom();
	nameobj.moveToTop();
	preslayer.draw();

	viewobj.on('mousedown', function() {
		if (mousedown_action == false) {
			activeviewobj = this;

			var vchildren = preslayer.getChildren().toArray();
			for (var i = 0; i < vchildren.length; i++) {
				var selobj = vchildren[i];
				if (activeviewobj == selobj) {
					selobj.find('.viewblock').fill(viewselectcol);
				} else {
					selobj.find('.viewblock').fill(viewnonselcol);
				}

			}
			preslayer.draw();
		} else {
			mousedown_action = false;
		}
		updateViewPropDisp();

	});

	viewobj.setAttr('state', state);
	return viewobj;
}

function createPEandViews(peinfo) {
	console.log("createPEandViews");
	var evlists = peinfo.evl;
	var seviews = peinfo.sev;
	preslayer.destroyChildren();
	presstage.clear();

	makeStartEvent(seviews);
	// get views from first entry
	if (evlists.length > 0) {
		var pestate = evlists[0];
		var peviews = pestate.peviews;
		for (var vi = 0; vi < peviews.length; vi++) {
			var view = makeView(peviews[vi].viewstate);
			views.push(view);
		}
		// make PEs
		for (var pei = 0; pei < evlists.length; pei++) {
			pestate = evlists[pei];
			console.log(pestate);
			makePresentEvent(pestate);
		}

		preslayer.draw();
		openingProject = false;
	}
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
		} else if (element.mozRequestFullScreen) {
			element.mozRequestFullScreen(); //Mozilla
			fullscreen = true;
		} else if (element.webkitRequestFullScreen) {
			element.webkitRequestFullScreen(); //Chrome, Safari
			fullscreen = true;
		}
	} else {
		if (document.cancelFullScreen) {
			document.cancelFullScreen();
			fullscreen = false;
		} else if (document.mozCancelFullScreen) {
			document.mozCancelFullScreen();
			fullscreen = false;
		} else if (document.webkitCancelFullScreen) {
			document.webkitCancelFullScreen();
			fullscreen = false;
		}
	}


}

function setCastmode() {
	castmode = $('#castaction').prop('checked');
}


function screenSetup() {
	/**
	 * Set up the various panels in the screen according to the screen mode and size
	 */
	var ww = $(window).width();
	var wh = $(window).height();
	$('#page').css({
		'height': Math.round(0.98 * wh).toString() + 'px'
	});
	$('#page').css({
		'width': Math.round(0.98 * ww).toString() + 'px'
	});
	var ph = $('#page').height();
	var pw = $('#page').width();
	$('#leftcolumn').css({
		'height': Math.round(1.0 * ph).toString() + 'px'
	});
	$('#leftcolumn').css({
		'width': Math.round(0.2 * pw).toString() + 'px'
	});
	$('#rightcolumn').css({
		'left': Math.round(0.2 * pw).toString() + 'px'
	});
	$('#rightcolumn').css({
		'height': Math.round(1.0 * ph).toString() + 'px'
	});
	$('#rightcolumn').css({
		'width': Math.round(0.8 * pw).toString() + 'px'
	});

	$('#functionspace').css({
		'height': Math.round(0.5 * ph).toString() + 'px'
	});
	$('#presentspace').css({
		'height': Math.round(ph - 10).toString() + 'px'
	});
	//$('#presentspace').height(Math.round(0.7*ph-10));
	$('#propedit').css({
		'height': Math.round(0.5 * ph - 12).toString() + 'px'
	});
	prh = $('#presentspace').height();
	prw = $('#presentspace').width();

}

function resizeStages() {
	/**
	 * Resize the stages to fit the new screen container sizes
	 */

}

function castPresentEvent() {
	if (activepeevobj != null) {
		var castind = presentevents.indexOf(activepeevobj);
		if (castind > -1) {
			var msg = JSON.stringify({
				command: 'castPEinfo',
				info: castind
			});
			socket.emit('updateEvents', msg);
		}
	}
}

function castStartEvent() {
	if (activepeevobj != null) {
		var spe = preslayer.find('.startevent')[0];
		var spestate = spe.getAttr('state');
		var startinfo = spestate.peviews;
		var msg = JSON.stringify({
			command: 'castStartinfo',
			info: startinfo
		});
		socket.emit('updateEvents', msg);
	}
}

function txPEventsArr() {
	//only emit states
	var statearr = [];
	for (var i = 0; i < presentevents.length; i++) {
		var pestate = presentevents[i].getAttr('state');
		statearr.push(pestate);
	}
	var spe = preslayer.find('.startevent')[0];
	var spestate = spe.getAttr('state');
	var seviews = spestate.peviews;
	var msg = JSON.stringify({
		command: 'updateEventArr',
		info: {
			pel: statearr,
			sev: seviews
		}
	});
	socket.emit('updateEvents', msg);
}

function txPEventsDelete(index) {

	var msg = JSON.stringify({
		command: 'deleteEventList',
		info: index
	});
	socket.emit('updateEvents', msg);
}

function txPEventsCheckDesign() {

	var msg = JSON.stringify({
		command: 'checkDesignScreen',
		info: ''
	});
	socket.emit('updateEvents', msg);
}

function txPEventsGetLayerInfo() {

	var msg = JSON.stringify({
		command: 'getLayerinfo',
		info: ''
	});
	socket.emit('updateEvents', msg);
}

function txPEventsGetPEInfo() {

	var msg = JSON.stringify({
		command: 'getPEinfo',
		info: ''
	});
	socket.emit('updateEvents', msg);
}

function txplayPEEvents(index) {

	var msg = JSON.stringify({
		command: 'playPE',
		info: index
	});
	socket.emit('updateEvents', msg);
}

function txstartPEEvents(index) {

	var msg = JSON.stringify({
		command: 'startPE',
		info: index
	});
	socket.emit('updateEvents', msg);
}

function txplayEvent(peobj) {
	//message to screen to play
	var ind = presentevents.indexOf(peobj);
	txplayPEEvents(ind);
	//message to screen to play
	var pevstate = peobj.getAttr('state');
	for (var pei = 0; pei < pevstate.peviews.length; pei++) {
		var peview = pevstate.peviews[pei];
		var scrname = peview.viewstate.name;
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

function txstartEvent(peobj) {
	//message to screen to go to startstate
	var ind = presentevents.indexOf(peobj);
	txstartPEEvents(ind);
	//message to screen to go to startstate
	var pevstate = peobj.getAttr('state');
	for (var pei = 0; pei < pevstate.peviews.length; pei++) {
		var peview = pevstate.peviews[pei];
		var scrname = peview.viewstate.name;
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

function ioUpdate(respdata) {
	//console.log(respdata);
	var viewcommand = JSON.parse(respdata);
	var command = viewcommand.command;

	//console.log(command);
	switch (command) {

		case 'designready':
			var msg = viewcommand.info;
			if (msg == 'openready') {
				designready = true;
				$('#createpebutton').prop('disabled', false);
				$('#createviewbutton').prop('disabled', false);
				txPEventsGetPEInfo();
			} else if (msg == 'newready') {
				designready = true;
				$('#createpebutton').prop('disabled', false);
				$('#createviewbutton').prop('disabled', false);
				makeStartEvent([]);
				txPEventsGetLayerInfo();
			} else {
				designready = false;
				alert('Designscreen is not ready');
			}
			break;

		case 'layerinfo':
			layers = [{
				layerid: 'none',
				layername: 'none'
			}];
			Array.prototype.push.apply(layers, viewcommand.info);
			//console.log(layers);
			updatePEpropDisp();
			break;

		case 'peinfo':
			var peinfo = viewcommand.info;
			openingProject = true;
			createPEandViews(peinfo);
			txPEventsGetLayerInfo();
			break;

		case 'updateAllPEventActions':
			var statesarr = viewcommand.info;
			updateallPEventActions(statesarr);
			break;

	}

}

function setPlaymode() {
	playmode = $('#playaction').prop('checked');
}

function setup() {
	/**
	 * Initial set up
	 */
	if (USEIO) {
		socket = io(serverurl);
		socket.on('designmsg', function(respdata) {
			//console.log(respdata);
			ioUpdate(respdata);
		});
	}

	presstage = new Kinetic.Stage({
		container: presentspace,
		name: 'presentscreen',
		width: prstagew,
		height: prstageh
	});
	preslayer = new Kinetic.Layer({
		name: "preslayer"
	});
	presstage.add(preslayer);
	preslayer.draw();


	txPEventsCheckDesign();
	disableDesignButtons();




	document.addEventListener("fullscreenchange", function() {
		screenSetup();
		resizeStages();
	}, false);

	document.addEventListener("mozfullscreenchange", function() {
		screenSetup();
		resizeStages();
	}, false);

	document.addEventListener("webkitfullscreenchange", function() {
		screenSetup();
		resizeStages();
	}, false);

	screenSetup();

	//$('#playaction').prop( 'checked', playmode);

	$('#functionspace').resizable({
		// only use the southern handle
		handles: 's',
		// restrict the height range
		minHeight: 200,
		maxHeight: 380,
		// resize handler updates the content panel height
		resize: function(event, ui) {
			var currentHeight = ui.size.height;

			// this accounts for padding in the panels +
			// borders, you could calculate this using jQuery
			var padding = 12;

			// this accounts for some lag in the ui.size value, if you take this away
			// you'll get some instable behaviour
			$(this).height(currentHeight);

			// set the tree panel height
			var containerHeight = $('#leftcolumn').height();
			$("#propedit").height(containerHeight - currentHeight - padding);
		}
	});


}