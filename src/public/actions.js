var actionlistgap = 3;
var actionlistXoffset = 10;
var actionlistYoffset = 10;
var ineventactionXoffset = 5;
var ineventactionYoffset = 30;
var actobjw = 100;
var actobjh = 30;
var evobjw = 110;
var evobjh = 200;
var eventslots = 15;
var activeactobj = null;
var mousedown_action = false;
var actstage = null;
var actlayer = null;
var actw = 800;
var acth = 500;
var timespan = 3600; // seconds
var actiontypes = {'appear':'visible','disappear':'visible','fadein':'opacity','fadeout':'opacity','move':'position','arrowflow':'portion'};  //type:property
var actselectcol = '#ffffaa';
var actnonselcol = '#aaaadd';
var evselectcol = '#aaffaa';
var evnonselcol = '#aaccaa';
var castmode = false;
var activeactiontype = ''
var eventliststates = [];
var eventlistgap = 5;
var eventlistXoffset = 150;
var sounds = window.sounds || {};

function actionselect()
{
	activeactiontype = $('#actiontypeselect').val();

}

function makeLayerAnimation(actionlayer)
{
	var animlayer = actionlayer.getAttr('parentlayer');
	var anim = new Konva.Animation(function(frame) {
		var stopflag = true;
		var objlayer = this.getLayers()[0];
		var alayer = objlayer.getAttr('actionlayer');
		var animlist = alayer.getAttr('playlist');

		// console.log(animlist);
		for (var i = 0; i < animlist.length; i++) {
			var action = animlist[i];
			// console.log(action);
			if (action.targetType == "audio") {
				// Skip audio
				continue;
			}
			var prop = action.interpolateProp(frame);
			var obj = action.parentobject;
			var objstate = obj.getAttr('state');
			obj.setAttr(action.property, prop);

			if (action.property == 'position') {
				objstate.x = prop.x;
				objstate.y = prop.y;
			} else {
				objstate[action.property] = prop;
			}

			if ((frame.time-action.starttime*1000)>action.animDuration*1000) {
				stopflag = stopflag && true;   //if many objects wait until last one is finished
			} else {
				stopflag = stopflag && false;
			}
			//console.log(this.isRunning());
		}

		if (stopflag == true) {
			this.stop();
			frame.time = 0.0;
			//console.log('stopped',this.isRunning());
		}

	}, animlayer);

	actionlayer.setAttr('animation',anim);

}


function makeActionTypeOptions(obj) {
	var htmlstr = '';
	if (obj != null) {
		var objtype = obj.getAttr('state').type;

		if (objtype == "Audio") {

			htmlstr = htmlstr + '<option value="audio_play">play</option>';
			htmlstr = htmlstr + '<option value="audio_stop">stop</option>';

		} else {

			var acttypekeys = Object.keys(actiontypes);
			for (var i=0;i<acttypekeys.length;i++) {
				var acttype = acttypekeys[i];
				if (acttype != 'arrowflow') {
					htmlstr = htmlstr + '<option value="'+acttype+'">'+acttype+'</option>';
				} else {
					if (objtype == 'CurvedArrow') {
						htmlstr = htmlstr + '<option value="'+acttype+'">'+acttype+'</option>';
					}
				}
			}

		}
	}
	return htmlstr;
}

function getNodeActions(obj)
{
/**
* find all the actions in the layer which has obj as its parentobject
*/
var actionlayer = obj.getLayer().getAttr('actionlayer');
var actionlist = new Array();

	//console.log(obj);
	var lactions = actionlayer.find('.action');
	//console.log(lactions);
	for (var i=0;i<lactions.length;i++) {
		if (lactions[i].getAttr('action').parentobject == obj) {
			actionlist.push(lactions[i]);
		}
	}
	//console.log(actionlist);
	return actionlist;
}


/**
 * Action that animates the change of an object from a startstate to the endstate
 * Animation is from startstate to endstate of the property.
 */
function Action(parentobject,id,actiontype,startval,endval,starttime,duration)
{
	this.parentobject = parentobject;
	this.id = id;
	this.starttime = starttime;
	this.animDuration = duration;   //default 1 second
	this.actiontype = actiontype;
	this.property = actiontypes[actiontype];
	this.startstate = startval;
	this.endstate = endval;

	this.targetType = 'visual';
	this.src = null;

	if (actiontype == 'audio_play' || actiontype == 'audio_stop') {
		this.targetType = 'audio';
		this.src = this.parentobject.getAttr('src');
	}

	this.interpolateProp = function(frame) {
		var frac = 0.0;
		if ((frame.time-this.starttime*1000) > this.animDuration*1000) {
			frac = 1.0;
		}
		else {
			frac = (frame.time-this.starttime*1000)/(this.animDuration*1000);
		}
		var prop = this.parentobject.getAttr(this.property);
		if (frac>0.0) {
			switch(this.actiontype) {
				case 'move':
				var xpos = frac*(this.endstate.x-this.startstate.x)+this.startstate.x;
				var ypos = frac*(this.endstate.y-this.startstate.y)+this.startstate.y;
				prop = {x:xpos,y:ypos};
				break;

				case 'fadein':
				prop = frac*(this.endstate - this.startstate)+this.startstate;
				if (prop<0.0) {prop = 0.0;}
				break;

				case 'fadeout':
				prop = frac*(this.endstate - this.startstate)+this.startstate;
				if (prop<0.0) {prop = 0.0;}
				break;

				case 'appear':
				if (frac<1.0) {
					prop = this.startstate;
				}
				else {
					prop = this.endstate;
				}
				break;

				case 'disappear':
				if (frac<1.0) {
					prop = this.startstate;
				}
				else {
					prop = this.endstate;
				}
				break;

				case 'arrowflow':
				prop = this.startstate+frac*(this.endstate - this.startstate);
				break;

			}
		}

		return prop;
	};

}


Action.prototype.setStart = function() {
	var obj = this.parentobject;
	var prop = obj.getAttr(this.property);
	this.startstate = prop;
}

Action.prototype.setEnd = function() {
	var obj = this.parentobject;
	var prop = obj.getAttr(this.property);
	this.endstate = prop;
}

Action.prototype.settoStartstate = function () {
	var obj = this.parentobject;
	var prop = this.property;
	obj.setAttr(this.property,this.startstate);
	var objstate = obj.getAttr('state');
	if (prop == 'position') {
		objstate.x = this.startstate.x;
		objstate.y = this.startstate.y;
	}
	else {
		objstate[this.property] = this.startstate;
	}
}

Action.prototype.settoEndstate = function () {
	var obj = this.parentobject;
	var prop = this.property;
	obj.setAttr(this.property,this.endstate);
	var objstate = obj.getAttr('state');
	if (prop == 'position') {
		objstate.x = this.endstate.x;
		objstate.y = this.endstate.y;
	}
	else {
		objstate[this.property] = this.endstate;
	}

}


function startActionEvent()
{

	if (activeactobj != null) {
		if (activeactobj.name() == 'eventgroup') {
			var actchildren = activeactobj.find('.action');
			for (var i=0;i<actchildren.length;i++) {
				var action = actchildren[i].getAttr('action');
				action.settoStartstate();
			}
		}
		else if (activeactobj.name() == 'action') {
			var action = activeactobj.getAttr('action');
			action.settoStartstate();
		}
		layer.draw();
	}
}

function endActionEvent()
{

	if (activeactobj != null) {
		if (activeactobj.name() == 'eventgroup') {
			var actchildren = activeactobj.find('.action');
			for (var i=0;i<actchildren.length;i++) {
				var action = actchildren[i].getAttr('action');
				action.settoEndstate();
			}
		}
		else if (activeactobj.name() == 'action') {
			var action = activeactobj.getAttr('action');
			action.settoEndstate();
		}
		layer.draw();
	}
}

function playActionEvent() {

	if (activeactobj != null) {

		var playlist = new Array();

		if (activeactobj.name() == 'eventgroup') {
			var actchildren = activeactobj.find('.action');
			for (var i=0;i<actchildren.length;i++) {
				var action = actchildren[i].getAttr('action');
				playlist.push(action);
			}
		} else if (activeactobj.name() == 'action') {
			var action = activeactobj.getAttr('action');
			playlist.push(action);
		}

		var alayer = activeactobj.getLayer();
		alayer.setAttr('playlist', playlist);

		var objlayer = alayer.getAttr('parentlayer');
		//console.log(objlayer);

		var anim = alayer.getAttr('animation');
		//objlayer.draw();
		// console.log(anim);

		anim.start();

		// Do audio
		for (var i = 0; i < playlist.length; i++) {
			var action = playlist[i];
			var id = action.parentobject.getAttr("id");
			switch (action.actiontype) {
				case "audio_play":
					audioAction("play", id, action.src);
				break;

				case "audio_stop":
					audioAction("stop", id, action.src);
				break;
			}
		}
	}
}


function audioAction(action, id, src) {

	if ( ! sounds.hasOwnProperty(id)) {
		sounds[id] = new Howl({
			src: [src]
		});
	}

	switch (action) {
		case "play":
			sounds[id].play();
		break;
		case "stop":
			sounds[id].stop();
		break;
	}

	return;
}


function goNextEvent() {

	var events = [];
	// Find the event boxes in the lower panel
	var eventgroups = actlayer.find('.eventgroup');
	var selectedData = null;

	for (var i = 0; i < eventgroups.length; i++) {

		var box = eventgroups[i],
			boxState = box.getAttr('state'),
			isSelected = (activeactobj != null && activeactobj == box);

		if (boxState.name == "actionbox") {
			continue;
		}

		var data = { pos: box.position(), id: box.id(), index: i, isSlected: isSelected, name: boxState.name };
		events.push(data);

		if (isSelected) {
			selectedData = data;
		}
	}

	// Sort events by their x position (already determined elsewhere.)
	// The order of `eventgroups` is *not* the order they appear in.
	events.sort(function(a, b) {
		if (a.pos.x < b.pos.x) return -1;
		if (a.pos.x > b.pos.x) return 1;
		return 0;
	});

	if (events.length === 0) {
		console.warn("Next event: no events!");
		return;
	}

	var currentIdx = 0,
		nextIdx = 0;

	if (selectedData === null) {
		// No current selected item, start at 0
		selectedData = events[0];
		currentIdx = events.indexOf(selectedData);
		nextIdx = 0;
	} else {
		// Otherwise, get index of selected item and +1 to get next
		currentIdx = events.indexOf(selectedData);
		nextIdx = currentIdx + 1;
	}

	// Reached end? Reset to start
	if (nextIdx === events.length) {
		nextIdx = 0;
	}

	// Using the index of the next item, target it and fire mousedown event to "click" it.
	var index = events[nextIdx].index;
	eventgroups[index].fire("mousedown");
}


function playPEEvents(ind)
{
	if (ind>-1) {
		var pevstate = eventliststates[ind];
		var peviews = pevstate.peviews;
		for (var pei=0;pei<peviews.length;pei++) {
			var peview = peviews[pei];
			var pev = actstage.find('#'+peview.id)[0];
			if (pev != null) {
				activeactobj = pev;
				playActionEvent();
			}
		}
	}
}

function startPEEvents(ind)
{
	if (ind>-1) {
		var pevstate = eventliststates[ind];
		var peviews = pevstate.peviews;
		for (var pei=0;pei<peviews.length;pei++) {
			var peview = peviews[pei];
			var pev = actstage.find('#'+peview.id)[0];
			if (pev != null) {
				activeactobj = pev;
				startActionEvent();
			}
		}
	}
}

//draw an action object on the action pane
function actionobj(state,eventlistobj)
{
	var tspace = 10;
	var obj = null;
	// console.log("actionobj");
	// console.log(state);
	// console.log('#'+state.parentobjectid);
	var parentobject = layer.find('#'+state.parentobjectid)[0];
	if (parentobject === undefined) {
		// console.log("not found");
		return null;
	}

	if (state.id == 'none') {state.id = UniqueId();}

	var actobj = new Konva.Group({
		name:'action',
		draggable:true,
		id:state.id,
		x:state.x,
		y:state.y,
		width:actobjw,
		height:actobjh-tspace
	});


	var actblock = new Konva.Rect({
		name:'actblock',
		draggable:false,
		x:0,
		y:0,
		width:actobjw,
		height:actobjh-tspace,
		cornerRadius:5,
		fill:actnonselcol,
		stroke:'black',
		strokeWidth:1
	});

	actobj.setAttr('action',new Action(parentobject,state.id,state.actiontype,state.startstate,state.endstate,state.starttime,state.duration));

	var pname = parentobject.name();
	if (state.descriptor == '') {
		state.descriptor = state.actiontype+'_'+pname;
	}

	var actionname = state.descriptor;

	var displaystr = (actionname).slice(0,15);
	var nameobj = new Konva.Text({
		name:'actname',
		draggable: false,
		x:5,
		y:actobjh/2-tspace,
		text:displaystr,
		fontSize:12,
		fill:'black'

	});

	actobj.add(actblock);
	actobj.add(nameobj);
	eventlistobj.add(actobj);
	actobj.setAttr('state',state);
	actobj.find('.actblock').stroke(evnonselcol);
	//	var actboxstate = eventlistobj.getAttr('state');
	//	actboxstate.actions.push(state);
	//	eventlistobj.setAttr('state',actboxstate);

	actobj.moveToTop();
	nameobj.moveToTop();

	actobj.on('mouseover', function() {
		document.body.style.cursor = 'pointer';
		cursorstate = 'onact';
	});

	actobj.on('mouseout', function() {
		document.body.style.cursor = 'default';
		cursorstate = 'free';
	});

	actobj.on('mousedown', function() {
		activeactobj = this;
		mousedown_action = true;
		showActionPropDisp()
		var actchildren = actlayer.find('.action');
		for (var i=0;i<actchildren.length;i++) {
			var selobj = actchildren[i];
			if (activeactobj == selobj) {
				selobj.find('.actblock').fill(actselectcol);
			}
			else {
				selobj.find('.actblock').fill(actnonselcol);
			}

		}
		actlayer.draw();

		if (castmode ==  true) {
			playActionEvent();
		}

	});

	actobj.on('dragstart', function (e) {
		var dragobj = e.target;
		dragobj.find('.actblock').stroke('#000000');
		var par = dragobj.getParent();
		par.moveToTop();
		dragobj.moveToTop();
	});

	actobj.on('dragmove', function (e) {
		e.target.moveToTop();
	});

	actobj.on('dragend', function (e) {

		var ingroupflag = false;
		var dragobj = e.target;
		var par = dragobj.getParent();
		var drx = dragobj.x()+par.x();
		var dry = dragobj.y()+par.y();

		var eventgroups  = actlayer.find('.eventgroup');
		for (var j=0;j<eventgroups.length;j++) {
			var evgroup = eventgroups[j];
			var egh = evgroup.height();
			var egw = evgroup.width();
			var egx = evgroup.x();
			var egy = evgroup.y();

			if ((drx<(egx+egw)) && (drx>egx) && (dry<(egy+egh)) && (dry>egy)) {
				this.moveTo(evgroup);
				this.find('.actblock').stroke(evnonselcol);
				this.moveToTop();
				ingroupflag = true;
			/*		var evstate = evgroup.getAttr('state');
					evstate.actions.push(this.getAttr('state'));
					evgroup.setAttr('state',evstate); */
					updateActionList(evgroup);
					updateEventactions();

				}
			}

/*			if (ingroupflag == false) {
					par = dragobj.getParent();
					if (par != actlayer) {
						//this.moveTo(actlayer);
						this.find('.actblock').stroke('#000000');
						//this.x(dragobj.x() + par.x());
						//this.y(dragobj.y() + par.y());
						var evstate = par.getAttr('state');
						var index = evstate.actions.indexOf(this.getAttr('state'));
						evstate.actions.splice(index,1);
						updateActionList();
						par.setAttr('state',evstate);

					}
				} */
				var objstate = this.getAttr('state');
				objstate.x = this.x();
				objstate.y = this.y();
				this.setAttr('state',objstate);
				showActionPropDisp();
				actlayer.draw();

			});

	updateActionList(eventlistobj);
	return actobj;
}

function newAction()
{
	if (activeobject != null && selectednode.type != 'Stage' && selectednode.type != 'Layer') {
		var margin = 10;
		var ypos = margin;
		var xpos = margin;
		var actobj = null;
		var actionbox = actlayer.getAttr('actionbox');


		var acttype = $('#actiontypeselect').val();
		switch(acttype) {
			case 'appear':
			var state = {
				descriptor:'',
				parentobjectid:activeobject.id(),
				id:'none',
				actiontype:acttype,
				property:actiontypes[acttype],
				x:xpos,
				y:ypos,
				startstate:false,
				endstate:true,
				starttime:0.0,
				duration:1.0
			};
			actobj = actionobj(state,actionbox);
			break;

			case 'disappear':
			var state = {
				descriptor:'',
				parentobjectid:activeobject.id(),
				id:'none',
				actiontype:acttype,
				property:actiontypes[acttype],
				x:xpos,
				y:ypos,
				startstate:true,
				endstate:false,
				starttime:0.0,
				duration:1.0
			};
			actobj = actionobj(state,actionbox);
			break;

			case 'fadein':
			var state = {
				descriptor:'',
				parentobjectid:activeobject.id(),
				id:'none',
				actiontype:acttype,
				property:actiontypes[acttype],
				x:xpos,
				y:ypos,
				startstate:0.0,
				endstate:1.0,
				starttime:0.0,
				duration:1.0
			};
			actobj = actionobj(state,actionbox);
			break;

			case 'fadeout':
			var state = {
				descriptor:'',
				parentobjectid:activeobject.id(),
				id:'none',
				actiontype:acttype,
				property:actiontypes[acttype],
				x:xpos,
				y:ypos,
				startstate:1.0,
				endstate:0.0,
				starttime:0.0,
				duration:1.0
			};
			actobj = actionobj(state,actionbox);
			break;

			case 'move':
			var state = {
				descriptor:'',
				parentobjectid:activeobject.id(),
				id:'none',
				actiontype:acttype,
				property:actiontypes[acttype],
				x:xpos,
				y:ypos,
				startstate:activeobject.getAttr(actiontypes[acttype]),
				endstate:activeobject.getAttr(actiontypes[acttype]),
				starttime:0.0,
				duration:1.0
			};
			actobj = actionobj(state,actionbox);
			break;

			case 'arrowflow':
			var state = {
				descriptor:'',
				parentobjectid:activeobject.id(),
				id:'none',
				actiontype:acttype,
				property:actiontypes[acttype],
				x:xpos,
				y:ypos,
				startstate:0.1,
				endstate:1.0,
				starttime:0.0,
				duration:1.0
			};
			actobj = actionobj(state,actionbox);
			break;

			case 'audio_play':
				var state = {
					descriptor: '',
					parentobjectid: activeobject.id(),
					id: 'none',
					actiontype: acttype
				}
				actobj = actionobj(state, actionbox);
			break;

			case 'audio_stop':
				var state = {
					descriptor: '',
					parentobjectid: activeobject.id(),
					id: 'none',
					actiontype: acttype
				}
				actobj = actionobj(state, actionbox);
			break;
		}

	}

}

function deleteAction() {
	if (activeactobj != null && activeactobj.name()=='action') {
		var ans = confirm('Are you sure you want to delete this action?');
		if (ans == true) {
			var par = activeactobj.getParent();
			activeactobj.destroyChildren();
			activeactobj.destroy();
			actlayer.draw();
			$("#proptable").empty();
			updateActionList(par);
			updateEventactions();
		}

	}

}

function removeEventList(pevid) {
	var pev = actstage.find('#'+pevid)[0];
	if (pev != null) {
		var alayer = pev.getLayer();
		var actbox = alayer.getAttr('actionbox');
		var pevchildren = pev.getChildren().toArray();
		for (var chi=0;chi<pevchildren.length;chi++) {
			var pchild = pevchildren[chi];
			if (pchild.name() == 'action') {
				pchild.moveTo(actbox);
			}
		}
		updateActionList(actbox);
		pev.destroyChildren();
		pev.destroy();
		alayer.draw();
	}
}

function deleteAllEventLists() {
	for (var ind = 0;ind<eventliststates.length;ind++) {
		var pevstate = eventliststates[ind];
		var peviews = pevstate.peviews;
		for (var pei=0;pei<peviews.length;pei++) {
			var peview = peviews[pei];
			removeEventList(peview.id);
		}
	}
	eventliststates = [];

}

function deleteEventList(delind) {

	if (delind>-1) {
		var pevstate = eventliststates[delind];
		var peviews = pevstate.peviews;
		for (var pei=0;pei<peviews.length;pei++) {
			var peview = peviews[pei];
			removeEventList(peview.id);
		}
		eventliststates.splice(delind,1);
		for (var i=0;i<eventliststates.length;i++) {
			eventliststates[i].index = i;
		}
	}
	updateEventSwimList();

}



function updateEventactions()
{
	for (var i=0;i<eventliststates.length;i++) {
		var pevstate = eventliststates[i];
		var peviews = pevstate.peviews;
		for (var pei=0;pei<peviews.length;pei++) {
			var peview = peviews[pei];
			if (peview.layerid != 'none') {
				peview.actions = [];
				if (actstage) {
					var evlist = actstage.find('#'+peview.id)[0];
					if (evlist) {
						var actionlist = evlist.find('.action');
						for (var ai=0;ai<actionlist.length;ai++) {
							var act = actionlist[ai];
							var actstate = act.getAttr('state');
							//console.log(actstate);
							peview.actions.push({id:actstate.id, name:actstate.descriptor});
						}
						eventliststates[i].peviews[pei] = peview;
						//console.log(eventliststates);
					}
				}
			}
		}
	}

	txupdateAllEventListActions(eventliststates);
}

function updateActionList(eventbox)
{
	if (actlayer != null) {
		if ( ! eventbox) {
			return;
		}
		var actionlist = eventbox.find('.action');
		for (var i=0;i<actionlist.length;i++) {
			var act = actionlist[i];

			var yoffset = ineventactionYoffset;
			for (var j=0;j<i;j++) {
				var block = act.find('.actblock')[0];
				yoffset = yoffset + block.height() + actionlistgap;
			}
			act.x(ineventactionXoffset);
			act.y(yoffset);
		}

		var boxheight = yoffset+actionlistgap+actobjh;
		if (boxheight > evobjh) {
			eventbox.height(boxheight);
			eventbox.find('.evblock').height(boxheight);
		}
		else {
			eventbox.height(evobjh);
			eventbox.find('.evblock').height(evobjh);

		}
		var actstageh = actionlistYoffset+yoffset+actionlistgap+actobjh;
		if (actstageh>actstage.height()) {
			actstage.height(actstageh);
		}
		actlayer.draw();
	}
}

function makeActionBox(alayer)
{
	actlayer = alayer;
	var actionbox = makeEventList({x:actionlistXoffset, y:actionlistYoffset, parentid:alayer.id(),id:UniqueId(),name:'actionbox',actiontype:'Eventlist',viewstate:{name:''},actions:[]});
	alayer.add(actionbox);
	actionbox.moveToBottom();
	alayer.setAttr('actionbox',actionbox);
	actstage.height(actionlistYoffset+evobjh+10);
}

function findEventState(parsid)
{
/**
* Find a PE state in the eventliststates array for a given id
*/
var found = false;
var i = 0;
var evs = null;
while (found == false && i<eventliststates.length)
{
	if (parsid == eventliststates[i].id) {
		found = true;
		evs = eventliststates[i];
	}
	i = i+1;
}
return evs;
}

function findPEinEventState(peviewid,pevstate)
{
/**
* Finds a PE peview index in the PEventliststate for a given eventlist id
*/
var found = false;
var i = 0;
var peviewindex = 0;
var pws = pevstate.peviews;
while (found == false && i<pws.length)
{
	if (peviewid == pws[i].id) {
		found = true;
		peviewindex = i;
	}
	i = i+1;
}
return peviewindex;
}

function updateEventSwimList()
{

	for (var i=0;i<eventliststates.length;i++) {
		var pevstate = eventliststates[i];
		var peviews = pevstate.peviews;
		for (var pei=0;pei<peviews.length;pei++) {
			var peview = peviews[pei];
			//console.log(peview);
			var pev = actstage.find('#'+peview.id)[0];
			if (peview.layerid == 'none') {
				if (pev != null) {
					removeEventList(peview.id);
					pev = null;
				}
			}
			else {
				var stlayer = stage.find('#'+peview.layerid)[0];
				if ( ! stlayer) {
					continue;
				}
				var alayer = stlayer.getAttr('actionlayer');
				if (pev == null) //create Eventlist on layer
				{
					pev = makeEventList({x:actionlistXoffset, y:actionlistYoffset, parentid:pevstate.id, id:peview.id, name: pevstate.name,actiontype:'Eventlist', viewstate:peview.viewstate, actions:peview.actions});
					alayer.add(pev);
					pev.moveToBottom();
				}
				else {
					if (alayer.id() != (pev.getLayer()).id()) { //layer has been changed so move and release actions
						removeEventList(peview.id);
						pev = makeEventList({x:actionlistXoffset, y:actionlistYoffset, parentid:pevstate.id, id:peview.id, name: pevstate.name,actiontype:'Eventlist', viewstate:peview.viewstate, actions:peview.actions});
						alayer.add(pev);
						pev.moveToBottom();
					}
					else {
						var numactions = peview.actions.length;
						var boxheight = ineventactionXoffset+numactions*(actionlistgap+actobjh);
						if (boxheight<evobjh) {
							pev.find('.evblock')[0].height(evobjh);
						}
						else {
							pev.find('.evblock')[0].height(boxheight);
						}
						(pev.find('.evname')[0]).text(pevstate.name);
						(pev.find('.scrname')[0]).text(peview.viewstate.name);
					}
				}
				alayer.batchDraw();
			}
		}
	}

//find eventlists on action layers that do not exist in eventliststates and remove them
 //first make list of all peview ids
 var peviewidarr = new Array();
 for (var i=0;i<eventliststates.length;i++) {
 	var pevstate = eventliststates[i];
 	var peviews = pevstate.peviews;
 	for (var pei=0;pei<peviews.length;pei++) {
 		var peview = peviews[pei];
 		if (peview.layerid != 'none') {
			//console.log(peview.layerid,peview);
			peviewidarr.push(peview.id);
		}
	}
}
//console.log(peviewidarr);
 // now try and find it in the list of boxes on actionlayers


 var actlayers = actstage.getLayers().toArray();

 for (var li=0;li<actlayers.length;li++) {
 	var alayer = actlayers[li];
 	var layerblocks = (alayer.find('.eventgroup')).toArray();
 	for (var lb=0;lb<layerblocks.length;lb++) {
		// check if it is in peview id list
		var el = layerblocks[lb];
		var elstate = el.getAttr('state');
		if (elstate.name != 'actionbox') {
			blindex = peviewidarr.indexOf(el.id());
			if (blindex == -1) {  //remove if not in id list
				removeEventList(el.id());
			}
		}
	}

}


//arrange blocks on each actionlayer
for (var li=0;li<actlayers.length;li++) {
	var alayer = actlayers[li];
	var layerblocks = (alayer.find('.eventgroup')).toArray();
//find actionbox and exclude
var aboxindex = layerblocks.findIndex(function (el,ind,arr) {
	var elstate = el.getAttr('state');
	if (elstate.name == 'actionbox') { return true;}
	return false;
});
if (aboxindex > -1) {
	layerblocks.splice(aboxindex,1);
}
//sort according to index
layerblocks.sort(function (a,b) {
	var statea = a.getAttr('state');
	var stateb = b.getAttr('state');

	var parida = statea.parentid;
	var para = findEventState(parida);
	if (para === null) {
		return 0;
	}
	var parindexa = para.index;
	var peviewindexa = findPEinEventState(statea.id,para);

	var paridb = stateb.parentid;
	var parb = findEventState(paridb);
	var parindexb = parb.index;
	var peviewindexb = findPEinEventState(stateb.id,parb);

	if (parindexa < parindexb) { return -1; }
	if (parindexa > parindexb) { return 1; }
	if (parindexa == parindexb) {
		if (peviewindexa < peviewindexb) { return -1; }
		if (peviewindexa > peviewindexb) { return 1; }
	}
	return 0;
});
		//console.log(layerblocks);

		for (var bi=0; bi<layerblocks.length;bi++) {
			var xoffset = eventlistXoffset + bi*(eventlistgap+evobjw);
			layerblocks[bi].x(xoffset);

	//check that stage is still wide enough
	var actstagew = xoffset+eventlistgap+evobjw;
	if (actstagew > actstage.width()) {
		actstage.width(actstagew);
	}
}
alayer.draw();
}
actstage.clear();
actlayer.draw();
}

function makeEventList(state) {


	var eventobj = new Konva.Group({
		name:'eventgroup',
		draggable:false,
		id:state.id,
		x:state.x,
		y:state.y,
		width:evobjw,
		height:evobjh
	});

	eventobj.setAttr('state',state);

	var evblock = new Konva.Rect({
		name:'evblock',
		draggable:false,
		x:0,
		y:0,
		width:evobjw,
		height:evobjh,
		cornerRadius:0,
		fill:evnonselcol,
		stroke:'black',
		strokeWidth:1
	});


	var displaystr = (state.name).slice(0,10);
	var nameobj = new Konva.Text({
		name:'evname',
		draggable: false,
		x:5,
		y:5,
		text:displaystr,
		fontSize:12,
		fill:'black'

	});

	displaystr = (state.viewstate.name).slice(0,10);
	var scrnameobj = new Konva.Text({
		name:'scrname',
		draggable: false,
		x:5,
		y:15,
		text:displaystr,
		fontSize:12,
		fill:'black'

	});

	eventobj.add(evblock);
	eventobj.add(nameobj);
	eventobj.add(scrnameobj);
/*
		for (var ev=0;ev<state.actions.length;ev++) {
			var evstate = state.actions[ev];
			var acobj = actionobj(evstate);
			eventobj.add(acobj);
		}
		*/
		//actlayer.add(eventobj);
		//eventobj.moveToBottom();
		//actlayer.draw();

		eventobj.on('mouseover', function() {
			document.body.style.cursor = 'pointer';
			cursorstate = 'onev';
		});

		eventobj.on('mouseout', function() {
			document.body.style.cursor = 'default';
			cursorstate = 'free';
		});

		eventobj.on('mousedown', function() {
			if (mousedown_action == false) {
				activeactobj = this;
				showActionPropDisp();
				var actchildren = actlayer.getChildren().toArray();
				for (var i=0;i<actchildren.length;i++) {
					var selobj = actchildren[i];
					if (activeactobj == selobj) {
						selobj.find('.evblock').fill(evselectcol);
					}
					else {
						selobj.find('.evblock').fill(evnonselcol);
					}

				}
				var actchildren = actlayer.find('.action');
				for (var i=0;i<actchildren.length;i++) {
					var selobj = actchildren[i];
					selobj.find('.actblock').fill(actnonselcol);
				}
				actlayer.draw();
			}
			else {
				mousedown_action = false;
			}

			if (castmode == true) {
				playActionEvent();
			}
		});


		return eventobj;
	}


//property edit
function actpropLimits(propkey)
{
	var dw = $('#actionpane').width();
	var dh = $('#actionpane').height();
	switch(propkey) {
		case 'x':
		return {min:0,max:dw,step:5};
		break;
		case 'y':
		return {min:0,max:dh,step:5};
		break;
		case 'width':
		return {min:0,max:dw,step:5};
		break;
		case 'height':
		return {min:0,max:dh,step:5};
		break;
		case 'radius':
		return {min:0,max:dh/2,step:5};
		break;
		case 'cornerRadius':
		return {min:0,max:100,step:1};
		break;
		case 'innerRadius':
		return {min:0,max:dh/2,step:5};
		break;
		case 'outerRadius':
		return {min:0,max:dh/2,step:5};
		break;
		case 'opacity':
		return {min:0,max:1,step:0.1};
		break;
		case 'lineLength':
		return {min:1,max:Math.sqrt(dw*dw + dh*dh),step:5};
		break;
		case 'scaleSize':
		return {min:0.1,max:10,step:0.1};
		break;
		case 'strokeWidth':
		return {min:0.1,max:10,step:0.1};
		break;
		case 'sides':
		return {min:3,max:30,step:1};
		break;
		case 'arrowWidth':
		return {min:1,max:100,step:2};
		break;
		case 'arrowheadWidth':
		return {min:1,max:100,step:2};
		break;
		case 'arrowheadLength':
		return {min:1,max:100,step:2};
		break;
		case 'midX':
		return {min:-dw,max:dw,step:5};
		break;
		case 'midY':
		return {min:-dh,max:dh,step:5};
		break;
		case 'endX':
		return {min:-dw,max:dw,step:5};
		break;
		case 'endY':
		return {min:-dh,max:dh,step:5};
		break;
		case 'rotation':
		return {min:-180,max:180,step:1};
		break;
		case 'fontSize':
		return {min:6,max:200,step:2};
		break;

		case 'duration':
		return {min:0.1,max:10,step:0.1};
		break;
		case 'starttime':
		return {min:0.1,max:10,step:0.1};
		break;
		default:
		return {min:0,max:1,step:0.1};
		break;
	}
}

function actcolorPropValue(prop)
{
	var propkey = Object.keys(prop)[0];
	var propval = prop[propkey];
		//console.log(propkey,propval);
		$("#prop"+propkey).val(propval);

		prop[propkey] = checkInput(propval);
		updateAction(prop);
	}

function actsliderPropValue(prop) { //for number types
	var propkey = Object.keys(prop)[0];
	var propval = prop[propkey];
		//console.log(propkey,propval);
		var num = parseFloat(propval);
		if ((num % 1) == 0.0) { $("#prop"+propkey).val(num.toFixed(0));}
		else { $("#prop"+propkey).val(num.toFixed(2));}

		prop[propkey] = checkInput(propval);
		updateAction(prop);

	}

function actnudgePropValue(prop) { //for number types
	var propkey = Object.keys(prop)[0];
	var limits = actpropLimits(propkey);
	var minval = limits.min;
	var maxval = limits.max;
	var nudgeval = prop[propkey];
	var propval = $("#prop"+propkey).val();
		//console.log(propkey,propval,nudgeval);
		var num = parseFloat(propval)+parseFloat(nudgeval);
		if (num<minval) {num = minval;}
		if (num>maxval) {num = maxval;}

		if ((num % 1) == 0.0) { $("#prop"+propkey).val(num.toFixed(0));}
		else { $("#prop"+propkey).val(num.toFixed(2));}

		prop[propkey] = checkInput(num);
		//console.log(prop);
		updateAction(prop);

	}

function acteditboxPropValue(prop) { //for number types
	var propkey = Object.keys(prop)[0];
	var propval = prop[propkey];
		//console.log(propkey,propval);

		var num = parseFloat(propval);
		var limits = actpropLimits(propkey);
		var minval = limits.min;
		var maxval = limits.max;

		if (num < minval) {
			num = minval;
		}

		if (num > maxval) {
			num = maxval;
		}

		if ((num % 1) == 0.0) {$("#prop"+propkey).val(num.toFixed(0));}
		else { $("#prop"+propkey).val(num.toFixed(2));}

		propval = num.toString();
		prop[propkey] = checkInput(propval);
		updateAction(prop);

	}

	function updateAction(prop)
	{
		var state = activeactobj.getAttr('state');
		for (var propkey in prop) {
			var propval = prop[propkey];
			state[propkey] = propval;

			if (propkey == 'descriptor') {
				switch(activeactobj.name()) {
					case 'action':
					activeactobj.find('.actname').text(propval);
					break;
					case 'eventgroup':
					activeactobj.find('.evname').text(propval);
					break;

				}
			}

			if (propkey == 'x' || propkey == 'y') {
				activeactobj.setAttr(propkey,propval);
			}
		}

		if (activeactobj.name() == 'action') {
			var action = activeactobj.getAttr('action');
			action.startstate = state.startstate;
			action.endstate = state.endstate;
			action.starttime = state.starttime;
			action.animDuration = state.duration;
		}
		activeactobj.setAttr('state',state);
		actlayer.draw();

		updateEventactions();
	}

	function setPropVal(prop) {
		var key = Object.keys(prop)[0];
		var action = activeactobj.getAttr('action');
		var state = activeactobj.getAttr('state');
		switch(key) {
			case 'startstate':
			action.setStart();
			break;
			case 'endstate':
			action.setEnd();
			break;

		}
		state[key] = action[key];
	//console.log(state[key]);
	$("#prop"+key).text(JSON.stringify(state[key]));
}

function showActionPropDisp()
//populates the property list from the action attribute.
//
{
		//make table to display
		$("#proptable").empty();

		var state = activeactobj.getAttr('state');
		//console.log(state);
		for (var key in state) {
			var propval = state[key];
			if (key == 'actiontype' || key == 'property' || key == 'parentobjectid') {
				if (key == 'parentobjectid') {
					var parentobject = layer.find('#'+propval)[0];
					$("#proptable").append('<tr><td class="tablekey">parentobject</td><td colspan="2" class="tableval" style="text-align:left">'+parentobject.name()+'</td></tr>');
				}
				else {
					if (propval.length < tbltxtoverflow) {
						$("#proptable").append('<tr><td class="tablekey">'+key+'</td><td colspan="2" class="tableval" style="text-align:left">'+propval+'</td></tr>');
					}
					else {  //flow over into next line
						$("#proptable").append('<tr><td class="tablekey">'+key+'</td><td colspan="2" class="tableval" style="text-align:left">'+propval.substr(0,tbltxtoverflow)+'</td></tr>');
						$("#proptable").append('<tr><td class="tablekey"></td><td colspan="2" class="tableval" style="text-align:left">'+propval.substr(tbltxtoverflow)+'</td></tr>');
					}
				}
			}
			else {
				if (key != 'id' && key != 'index'&& key != 'x'&& key != 'y' && key != 'parentid' && key != 'name') {
				//console.log(typeof propval,key);
				switch(typeof propval) {
					case 'string':
					if (key == 'fill' || key == 'stroke') {
						if (propval.length != 7 && propval.slice(0,1) != '#') { propval = '#000000';}
						$("#proptable").append('<tr><td class="tablekey">'+key+'</td><td class="tableval"><input id="prop'+key+'" type="text" style="text-align:left" size="7" onchange="updateAction({'+key+':this.value})"></td><td class="tablegui"><input class="tablegui" type="color" value="'+propval+'" onchange="actcolorPropValue({'+key+':this.value})"></td></tr>');
						$("#prop"+key).val(propval);
					}
					else {
						$("#proptable").append('<tr><td class="tablekey">'+key+'</td><td class="tableval"><input id="prop'+key+'" type="text" style="text-align:left" size="12" onchange="updateAction({'+key+':this.value})"></td><td class="tablegui"></td></tr>');
						$("#prop"+key).val(propval);
					}
					break;
					case 'boolean':
					$("#proptable").append('<tr><td class="tablekey">'+key+'</td><td class="tableval"><input id="prop'+key+'" type="checkbox" onchange="updateAction({'+key+':this.checked})"></td></tr>');
					$("#prop"+key).prop( "checked", propval);
						//document.getElementById("prop"+key).checked = propval;

						break;
						case 'number':
						var limits = actpropLimits(key);
						var minval = limits.min;
						var maxval = limits.max;
						var stepval = limits.step;
						$("#proptable").append('<tr><td class="tablekey">'+key+'</td><td class="tableval"><input id="prop'+key+'" type="text" style="text-align:right" size="7" onchange="acteditboxPropValue({'+key+':this.value})"></td><td class="guirow"><button class="tablenudge" onclick="actnudgePropValue({'+key+':-'+stepval.toString()+'})">-</button><input class="tablegui" type="range" min="'+minval.toString()+'" max="'+maxval.toString()+'" step="'+stepval.toString()+'" value="'+propval+'" onchange="actsliderPropValue({'+key+':this.value})"><button class="tablenudge" onclick="actnudgePropValue({'+key+':'+stepval.toString()+'})">+</button></td></tr>');
						var num = parseFloat(propval);
						if ((num % 1) == 0.0) { $("#prop"+key).val(num.toFixed(0));}
						else { $("#prop"+key).val(num.toFixed(2));}
						break;
						case 'object':
						if (key == 'startstate' || key == 'endstate') {
							$("#proptable").append('<tr><td class="tablekey">'+key+'</td><td class="tableval" style="text-align:left" id="prop'+key+'"></td><td><button class="tablebutton" onclick="setPropVal({'+key+':0})">set value</button></td></tr>');
							var valstr = JSON.stringify(propval);
							$("#prop"+key).text(valstr);
						}
						break;
					}
				}
			}
		}
	}


