var project = { id: 'project', name: 'Project', creator: 'unknown', type: 'Project', createdate: 'ddmmyyyy', lastdate: 'ddmmyyyy', screenheight: 1080, screenwidth: 1920, layers: [], presentevents: [], starteventviews: [], groups: [] };
var fullscreen = false;
var openedproject = false; //used to control tree node unpacking
var projectopened = false; //whether project opened or new
var nodelist = [];  // list of {parentid:id,nodeid:nid,nodestate:state}
var selectedObjlist = [];
var listcounter = 0;
var showall = false;
var sw, sh;
var USEIO = true;
var socket;
var serverurl = 'http://' + window.location.hostname + ':' + window.location.port;
var txscale = 1.0;
serverurl = serverurl.replace(/:$/, '');

function makeCurvedArrow() {
	if (layer != null) {
		var obj = addobj('CurvedArrow');
		var state = obj.getAttr('state');
		state.name = uniqueNameonLayer(obj);
		obj.name(state.name);
		//console.log(obj);
		obj.setAttr('state', state);
		addTreeNode(layer.id(), obj.id(), state);
	}
	else {
		alert('no layer is defined');
	}

}



function updateprojState(prop) {
	/**
	* Updates the state attribute of the project
	*/
	var propkey = Object.keys(prop)[0];
	var propval = prop[propkey];
	//console.log(propkey,propval);
	project[propkey] = propval;
	if (propkey == 'name') {
		treecontainer.jstree(true).rename_node(selectednode, propval);
	}
	if (propkey == 'screenwidth' || propkey == 'screenheight') {
		//adjust active screen area and txscale
		stageDims();
		//project.screenwidthstage.setAttr('state',stagestate);
	}


}

function updateprojPropDisp() {
	/**
	*Updates the displayed properties of the project
	*/
	var state = project;

	//make table to display
	$("#proptable").empty();
	for (var key in state) {
		if (key != 'layers' && key != 'actions' && key != 'library' && key != 'id' && key != 'presentevents' && key != 'starteventviews' && key != "groups") {
			var propval = state[key];
			if (key == 'type' || key == 'createdate' || key == 'lastdate') {
				$("#proptable").append('<tr><td class="tablekey">' + key + '</td><td class="tableval" style="text-align:left">' + propval + '</td></tr>');

			}
			else {
				if (isNaN(propval)) {
					$("#proptable").append('<tr><td class="tablekey">' + key + '</td><td class="tableval"><input id="prop' + key + '" type="text" style="text-align:left" size="10" onchange="updateprojState({' + key + ':this.value})"></td></tr>');
				}
				else {
					$("#proptable").append('<tr><td class="tablekey">' + key + '</td><td class="tableval"><input id="prop' + key + '" type="text" style="text-align:right" size="10" onchange="updateprojState({' + key + ':checkInput(this.value)})"></td></tr>');
				}
				var el = document.getElementById("prop" + key);
				if (isNaN(propval)) {
					$("#prop" + key).val(propval);
				}
				else {
					var num = parseFloat(propval);
					//console.log(propval,num);
					if ((num % 1) == 0.0) { $("#prop" + key).val(propval.toFixed(0)); }
					else { $("#prop" + key).val(propval.toFixed(2)); }
				}
			}
		}
	}
}

function updateObjStateandTree(prop) {
	/**
	* Updates the state attribute and the tree node of the active object
	* This calls the updateGroupState or updateState functions in llcore.js depending on the type
	*/
	if (selectedObjlist.length > 1) {
		for (var obji = 0; obji < selectedObjlist.length; obji++) {
			var obj = selectedObjlist[obji];
			var state = obj.getAttr('state');
			if (state.type == 'Group') {
				updateGroupState(obj, prop);
			}
			else {
				updateState(obj, prop);
			}
		}
		activeobject = obj;
	}
	else if (activeobject != null) {
		var state = activeobject.getAttr('state');
		if (state.type == 'Group') {
			updateGroupState(activeobject, prop);
		}
		else {
			updateState(activeobject, prop);
		}
		var propkey = Object.keys(prop)[0];
		var propval = prop[propkey];
		//console.log(propkey,propval);
		//update tree if there
		if (treecontainer && propkey == 'name') {
			treecontainer.jstree(true).rename_node(selectednode, propval);
		}

	}
}

function libuse() {
	/**
	* Adds the selected library object on the libpane to the active layer and creates a treenode for it
	*/
	if (layer != null) {
		if (activelibobj != null) {
			var dw = $('#designspace').width();
			var dh = $('#designspace').height();
			var statestr = JSON.stringify(activelibobj.getAttr('state'));
			var state = JSON.parse(statestr);
			state.x = state.x + Math.floor(dw / 2);
			state.y = state.y + Math.floor(dh / 2);
			//console.log(state);
			if (state.type == 'Group') {
				var obj = newgroupobj(true, false, state);
				state.name = uniqueNameonLayer(obj);
				state.id = UniqueId();  //replace id if used from library else objects will have same ids
				obj.setAttr('state', state);
				layer.add(obj);
			}
			else {
				var obj = newobj(true, state);
				state.name = uniqueNameonLayer(obj);
				state.id = UniqueId();
				obj.setAttr('state', state);
				layer.add(obj);
			}
			obj.id(state.id);//replace id if used from library else objects will have same ids
			layer.draw();
			//console.log(obj.id());
			addTreeNode(layer.id(), obj.id(), state);
		}
	}
	else {
		alert('no layer is defined');
	}

}

function delObject() {
	/**
	* Deletes the selected object and removes it from the layer and tree
	*/
	if (activeobject != null) {
		var ans = confirm('Are you sure you want to delete this object?');
		if (ans == true) {
			//delete actions associated with object
			var actions = getNodeActions(activeobject);
			actlayer = layer.getAttr('actionlayer');
			for (var iact = 0; iact < actions.length; iact++) {
				actions[iact].destroy();
			}
			actlayer.draw();

			delobj();

			treecontainer.jstree(true).delete_node(selectednode);

		}
	}
}

function createObject() {
	var objtype = $('#objecttypeselect').val();
	//console.log(objdefaults);
	if (usedefaults == true && objdefaults[objtype] != null) {
		var objstate = JSON.parse(objdefaults[objtype]);
		objstate.id = 'none';
		objstate.name = 'none';
		//console.log(objstate);
		var obj = newobj(true, objstate);
		layer.add(obj);
		if (objSelector != null) {
			objSelector.deleteOldSelector();
			objSelector.drawSelector(obj);
		}
		activeobject = obj;
		updatePropDisp();
	}
	else {
		var obj = addobj(objtype);
		var objstate = obj.getAttr('state');
	}
	objstate.name = uniqueNameonLayer(obj);
	obj.name(objstate.name);
	obj.setAttr('state', objstate);
	layer.draw();

	addTreeNode(layer.id(), obj.id(), objstate);
}

function copyObject() {
	/**
	* Copies the selected object and adds it to the layer and tree with a unique name
	* Also assigns the selector object to the new copy
	*/
	if (activeobject != null) {
		var statestr = JSON.stringify(activeobject.getAttr('state'));
		var state = JSON.parse(statestr);
		state.name = 'none';
		state.id = 'none';
		state.x = state.x + 100;
		state.y = state.y + 100;
		//console.log(activeobject,state);
		if (state.type == 'Group') {
			var obj = newgroupobj(true, false, state);
		}
		else {
			var obj = newobj(true, state);
		}
		var objstate = obj.getAttr('state');
		objstate.name = uniqueNameonLayer(obj);
		obj.name(objstate.name);
		obj.setAttr('state', objstate);
		layer.add(obj);
		layer.draw();
		objSelector.deleteOldSelector();
		activeobject = obj;
		updatePropDisp();
		objSelector.drawSelector(obj);

		addTreeNode(layer.id(), obj.id(), objstate);
	}
}


function groupObjects() {
	/**
	* Groups all the objects added to the tempgroup into a new group object on the layer
	* removes the individual objects from tree before they are grouped
	* and creates a new group node for the group object in the tree
	*/
	for (var i = 0; i < tempgroup.length; i++) {
		var obj = tempgroup[i];
		//console.log(obj.id());
		treecontainer.jstree('delete_node', obj.id());
	}
	var grobj = groupobjects();
	var state = grobj.getAttr('state');
	state.name = uniqueNameonLayer(grobj);
	grobj.name(state.name);
	grobj.setAttr('state', state);
	addTreeNode(layer.id(), grobj.id(), state);
	ctrlkey = true;
	togMultiselect();
}

function ungroupObjects() {
	/**
	* Ungroups a group object into individual objects on the layer
	* Removes the group treenode and creates new tree nodes for the individual objects from the former group
	*/
	//delete actions associated with object
	var actions = getNodeActions(activeobject);
	actlayer = layer.getAttr('actionlayer');
	for (var iact = 0; iact < actions.length; iact++) {
		actions[iact].destroy();
	}
	actlayer.draw();

	var children = ungroupobjects();
	//console.log(children);
	if (children != null) {
		//remove active object from tree
		treecontainer.jstree(true).delete_node(selectednode);
		//add children to the tree
		for (var i = 0; i < children.length; i++) {
			var obj = children[i];
			//console.log(obj);
			var state = obj.getAttr('state');
			state.name = uniqueNameonLayer(obj);
			obj.name(state.name);
			obj.setAttr('state', state);
			//console.log(obj.id(),state.id);
			addTreeNode(layer.id(), obj.id(), state);
		}

	}
}

function filterlib() {
	/**
	* Displays the library objects found in the library database according to a filter term
	*/
	var filterstr = document.getElementById('filtername').value;
	clearObjects();
	loadObjects(filterstr);

}

function resetlib() {
	/**
	* Displays all the objects in the library database
	*/
	clearObjects();
	loadObjects('all');
}


function moveNode(node, newparentid, oldparentid, newposition, oldposition) {
	/**
	* Moves an object up or down in its z-index when the treenode of the object is moved in the tree
	*/
	var nodetype = node.type;
	switch (nodetype) {

		case 'Layer':
			layer.setZIndex(newposition);
			break;

		default:
			var newparent = treecontainer.jstree(true).get_node(newparentid);
			var oldparent = treecontainer.jstree(true).get_node(oldparentid);
			var oldlayer = stage.find('#' + oldparentid)[0];
			layer = stage.find('#' + newparentid)[0];

			obj = oldlayer.find('#' + node.id)[0];
			if (obj == null) {
				activeobject = null;
			}
			else {
				if (oldparentid == newparentid) {  //move within layer
					obj.setZIndex(newposition);
				}
				else {
					var actions = getNodeActions(obj);
					actlayer = layer.getAttr('actionlayer');
					for (var iact = 0; iact < actions.length; iact++) {
						actions[iact].moveTo(actlayer);
					}
					obj.moveTo(layer);
					obj.moveToTop();
					obj.setZIndex(newposition);
					treecontainer.jstree('select_node', newparentid);
				}
			}

			break;

	}

}

function selectObject(source) {
	/**
	* Manages the selection of the various node types of graphic objects such as stages, layers and shapes
	* Also determines whether the source of the selection is from the layer, tree or during grouping to manage events in the correct order
	*/
	var obj = null;
	switch (source) {
		case 'jstree':
			var id = selectednode.id;
			//console.log(selectednode.id);
			var nodetype = selectednode.type;

			switch (nodetype) {
				case 'Project':
					disableDesignButtons();
					clearActiveObject();
					clearTempGroup();
					updateprojPropDisp();
					break;

				case 'Layer':
					disableDesignButtons();
					clearActiveObject();
					clearTempGroup();
					if (stage != null) {
						stage.clear();
						layer = stage.find('#' + id)[0];
						if (layer != null) {
							activeobject = layer;
							actlayer = layer.getAttr('actionlayer');
							updatePropDisp();
							layer.draw();
							actstage.clear();
							actlayer.draw();
						}
					}
					break;

				default:
					//search for objects across all layers
					selectedObjlist.length = 0;
					for (var nodei = 0; nodei < selbotnodes.length; nodei++) {
						var oid = selbotnodes[nodei];
						var lcount = 0;
						var projlayers = stage.getLayers().toArray();
						var lr = projlayers[0];
						obj = null;
						while (obj == null && lcount < projlayers.length) {
							obj = projlayers[lcount].find('#' + oid)[0];
							lcount = lcount + 1;
						}

						if (obj != null) {
							selectedObjlist.push(obj);
						}
					}
					//console.log(selectedObjlist);
					if (selectedObjlist.length > 0) {
						obj = selectedObjlist[0];
					}
					else {
						obj = null;
					}

					//console.log(obj);
					if (obj == null) {
						activeobject = null;
					}
					else if (selectedObjlist.length > 1) {  //multiple nodes selected
						updateMultiplePropDisp();
					}
					else {  // single selected object
						activeobject = obj;
						var oldlayer = layer;
						layer = activeobject.getLayer();
						if (layer != oldlayer) {
							stage.clear();
							layer.draw();
						}
						actlayer = layer.getAttr('actionlayer');
						updatePropDisp();
						actstage.clear();
						actlayer.draw();

						if (objSelector == null) {
							objSelector = new objectSelector();
						}
						objSelector.drawSelector(obj);
						enableDesignButtons();
						$('#actiontypeselect').empty();
						$('#actiontypeselect').append(makeActionTypeOptions(activeobject));
						//remember last actiontype
						var opts = $('#actiontypeselect option');
						var values = $.map(opts, function (opt) {
							return ($(opt).val());
						});
						//console.log(values);
						if ($.inArray(activeactiontype, values) != -1) {
							$('#actiontypeselect').val(activeactiontype);
						}

					}

					break;

			}
			break;

		case 'grouping':
			enableDesignButtons();

			break;

		case 'kineticjs':
			if (activeobject != null) {
				layer = activeobject.getLayer();
				actlayer = layer.getAttr('actionlayer');
				//			stage = layer.getStage();
				enableDesignButtons();
				treecontainer.jstree('deselect_all');
				var id = activeobject.id();
				treecontainer.jstree('select_node', id);
				$('#actiontypeselect').empty();
				$('#actiontypeselect').append(makeActionTypeOptions(activeobject));
				//remember last actiontype
				var opts = $('#actiontypeselect option');
				var values = $.map(opts, function (opt) {
					return ($(opt).val());
				});
				//console.log(values);
				if ($.inArray(activeactiontype, values) != -1) {
					$('#actiontypeselect').val(activeactiontype);
				}

			}
			break;

	}
}



function createStage(stagestate) {
	/**
	* Creates a new stage when a view is created
	*/
	var hwratio = stagestate.screenheight / stagestate.screenwidth;
	var vh = sh - 4;
	var vw = sw - 4;
	var vhwratio = vh / vw;
	if (vhwratio > hwratio) {
		var stw = vw;
		var sth = Math.round(vw * hwratio);
	}
	else {
		var sth = vh;
		var stw = Math.round(vh / hwratio);
	}
	$('#' + stagestate.container).height(sth);
	$('#' + stagestate.container).width(stw);

	if (stagestate.id == 'none') { stagestate.id = UniqueId(); }

	var newstage = new Kinetic.Stage({
		container: stagestate.container,
		id: stagestate.id,
		name: stagestate.name,
		width: stw,
		height: sth
	});

	stagestate.txscale = stagestate.screenwidth / stw;
	newstage.setAttr('state', stagestate);
	return newstage;
}

function createLayer(layerstate) {
	/**
	* Creates a new layer on the active stage/view
	*/
	if (layer != null) { layer.clear(); }
	if (layerstate.id == 'none') { layerstate.id = UniqueId(); }
	var newlayer = new Kinetic.Layer({ name: layerstate.name, id: layerstate.id });
	newlayer.setAttr('state', layerstate);
	stage.add(newlayer);

	// create an action layer for this layer
	var actionlayer = new Kinetic.Layer({ name: "act_" + layerstate.name, id: UniqueId() });
	actstage.add(actionlayer);
	actionlayer.setAttr('parentlayer', newlayer);
	newlayer.setAttr('actionlayer', actionlayer);
	if (openedproject == false) {
		makeActionBox(actionlayer);
	}
	makeLayerAnimation(actionlayer);


	return newlayer;

}

function removeProject(pj) {
	/**
	* Remove a project from the database by making an ajax call to nodeio
	*/
	var projid = pj.getAttribute('data-projid');
	var projstatestr = pj.getAttribute('data-project');
	var projdetail = JSON.parse(projstatestr);
	var ans = confirm('Are you sure you want to remove the project ' + projdetail.name + '?');
	if (ans == true) {
		$.ajax({
			url: hostaddr + "/removeproject",
			type: "GET",
			data: { id: projid }
		})
			.done(function () {
				//alert( "success" );
				loadProjects();
			})
			.fail(function () {
				alert("error");
			})
			.always(function () {
				//alert( "complete" );


			});
	}

}

function newProject() {
	/**
	* Create a new project and instantiate the tree
	*/
	var cdate = (new Date()).toLocaleDateString();
	project = { id: 'project', name: 'Project', creator: 'unknown', type: 'Project', createdate: cdate, lastdate: cdate, screenheight: 1080, screenwidth: 1920, layers: [], presentevents: [], starteventviews: [], groups: [] };

	clearActiveObject();
	stage.clear();
	stage.destroyChildren();
	layer = null;
	actstage.clear();
	actstage.destroyChildren();
	projectopened = false;
	eventliststates = [];
	makeTree(project);
	disableDesignButtons();
}


function populateProject(proj) {
	/**
	* Populate the project with objects according to its projectstate
	* Builds a nodelist of all the objects in the project for fetchnextProjectnode function to operate on
	*/
	var layers = proj.layers;
	for (var j = 0; j < layers.length; j++) {
		var layerstate = layers[j];
		var newlayer = createLayer(layerstate);
		stage.add(newlayer);
		layer = newlayer;
		nodelist.push({ parentid: proj.id, nodeid: newlayer.id(), nodestate: layerstate });
		var objects = layerstate.children;
		for (var k = 0; k < objects.length; k++) {
			var objstate = objects[k];
			if (objstate.type == 'Group') {
				var obj = newgroupobj(true, false, objstate);
				layer.add(obj);
			}
			else {
				var obj = newobj(true, objstate);
				layer.add(obj);
			}
			layer.draw();
			nodelist.push({ parentid: newlayer.id(), nodeid: obj.id(), nodestate: objstate });

		}
		//add actions for the object
		actlayer = layer.getAttr('actionlayer');
		var eventlists = layerstate.eventlists;
		for (var m = 0; m < eventlists.length; m++) {
			var eventliststate = eventlists[m];
			var evobj = makeEventList(eventliststate);
			actlayer.add(evobj);
			//console.log(evobj);
			if (evobj.getAttr('state').name == 'actionbox') {
				actlayer.setAttr('actionbox', evobj);
			}
			for (var ai = 0; ai < eventliststate.actions.length; ai++) {
				var actstate = eventliststate.actions[ai];
				var actobj = actionobj(actstate, evobj);
			}

		}

	}
	//info to generate presentscreen views and presentevents
	eventliststates = [];
	Array.prototype.push.apply(eventliststates, proj.presentevents);

	stage.clear();
	layer.draw();
	updateEventSwimList();
}

function fetchnextProjectNode() {
	/**
	* Called by tree when nodes are created during opening of project
	* allows nodes to be added recursively on nodecreate event of tree to allow each operation to complete
	* before new node is added
	*/

	if (listcounter < nodelist.length) {
		var nodeinfo = nodelist[listcounter];
		listcounter += 1;
		return nodeinfo;
	}
	else {
		openedproject = false; // when done
		listcounter = 0;
		return null;
	}
}


function openProject(pj) {
	/**
	* Opens a project and builds a tree from nodes in project state using nodelist, makeTree and populateProject
	* using event driven sequence
	*/

	var projid = pj.getAttribute('data-projid');

	$.getJSON(hostaddr + "/getproject/" + projid, function (data) {

		$("#projects").empty();

		openedproject = true;
		projectopened = true;

		clearActiveObject();
		stage.clear();
		stage.destroyChildren();
		actstage.clear();
		actstage.destroyChildren();

		project = data.json;
		project.id = projid;
		eventliststates = [];
		Array.prototype.push.apply(eventliststates, project.presentevents);
		nodelist = [];
		populateProject(project);
		listcounter = 0;

		makeTree(project);

		stageDims();

		setTimeout(function () {
			if (layer == null) {
				layer = stage.getLayers()[0];
			}
			layer.draw();
			var id = layer.id();
			treecontainer.jstree('select_node', id);
			txReady('openready');
		}, 500);
	});

}


function packageProject() {
	/**
	* packages a project to a json object for saving or transmission to screens
	*/
	var ldate = (new Date()).toLocaleDateString();
	var layerstatearr = new Array();
	var eventliststatearr = new Array();
	var actionstatearr = new Array();
	var objstatearr = new Array();


	var projlayers = stage.getLayers().toArray();
	layerstatearr = [];
	for (var vch = 0; vch < projlayers.length; vch++) {
		var vlayer = projlayers[vch];
		var layerstate = vlayer.getAttr('state');

		var lchildren = vlayer.getChildren().toArray();
		objstatearr = [];
		for (var lch = 0; lch < lchildren.length; lch++) {
			var lchild = lchildren[lch];
			if (lchild.name() != 'Selector') {  //get rid of selector before saving
				var childstate = lchild.getAttr('state');
				objstatearr.push(childstate);
			}
		}
		layerstate.children = objstatearr;

		var actionlayer = vlayer.getAttr('actionlayer');
		var layereventlists = actionlayer.find('.eventgroup');
		eventliststatearr = [];
		for (var evi = 0; evi < layereventlists.length; evi++) {
			var evlistactions = layereventlists[evi].find('.action');
			actionstatearr = [];
			for (var ai = 0; ai < evlistactions.length; ai++) {
				var actstate = evlistactions[ai].getAttr('state');
				actionstatearr.push(actstate);
			}
			var evstate = layereventlists[evi].getAttr('state');
			evstate.actions = actionstatearr;
			eventliststatearr.push(evstate);

		}
		layerstate.eventlists = eventliststatearr;



		layerstatearr.push(layerstate);
	}

	var projstate = {
		id: project.id,
		name: project.name,
		creator: project.creator,
		type: 'Project',
		createdate: project.createdate,
		lastdate: ldate,
		screenwidth: project.screenwidth,
		screenheight: project.screenheight,
		layers: layerstatearr,
		presentevents: eventliststates,
		starteventviews: project.starteventviews,
		groups: project.groups
	};


	return projstate;
}

function saveProject() {
	/**
	* Saves a project to the database with an ajax call to nodeio
	*/
	var ldate = (new Date()).toLocaleDateString();
	var projstate = packageProject();
	var projectjson = JSON.stringify(projstate);


	$.ajax({
		url: hostaddr + "/addproject",
		type: "POST",
		data: { id: project.id, name: project.name, cdate: project.createdate, ldate: ldate, creator: project.creator, state: projectjson }
	})
		.done(function (resp) {
			//alert( "success" );
			//console.log(resp);
			project.id = resp;
		})
		.fail(function () {
			alert("error");
		})
		.always(function () {
			//alert( "complete" );
		});

}

function saveasnewProject() {
	project.id = 'project';
	var cdate = (new Date()).toLocaleDateString();
	project.createdate = cdate;
	saveProject();
}

function showProjDetails(pj) {
	/**
	* Show project details in property table when the cursor hovers over the project icon when opening a project
	*/
	var projid = pj.getAttribute('data-projid');
	var projstatestr = pj.getAttribute('data-project');
	var projdetail = JSON.parse(projstatestr);
	$("#proptable").empty();

	$("#proptable").append('<tr><td class="tablekey">id</td><td class="tableval" style="text-align:left">' + projid + '</td></tr>');
	$("#proptable").append('<tr><td class="tablekey">name</td><td class="tableval" style="text-align:left">' + projdetail.name + '</td></tr>');
	$("#proptable").append('<tr><td class="tablekey">creator</td><td class="tableval" style="text-align:left">' + projdetail.creator + '</td></tr>');
	$("#proptable").append('<tr><td class="tablekey">created</td><td class="tableval" style="text-align:left">' + projdetail.createdate + '</td></tr>');
	$("#proptable").append('<tr><td class="tablekey">saved</td><td class="tableval" style="text-align:left">' + projdetail.lastdate + '</td></tr>');


}

function clearProps() {
	/**
	* Clears the property table panel
	*/
	$('#proptable').empty();
}

function loadProjects() {
	/**
	* List project icons in the tree panel when opening a project.  Lists projects returned from database after ajax call to nodeio.
	*/
	$("#tree").empty();
	$("#projects").empty();


	$.getJSON(hostaddr + "/getprojects", function (data) {
		$.each(data, function (index, item) {
			//console.log(item);
			var projid = item.id.toString();
			var projectObj = item;
			var projname = item.name;
			var projectStr = JSON.stringify(item);
			// var projstatestr = item.json;
			//						$("<div class='projecticon' data-projid='"+projid+"' data-project='"+projstatestr+"' onclick='openProject(this)' onmouseover='showProjDetails(this)' onmouseout='clearProps()'><img src='images/proj.png' />"+projname+"</div>" ).appendTo( "#projects" );
			var $row = $("<div class='projectrow' data-projid='" + projid + "' data-project='" + projectStr + "' onmouseover='showProjDetails(this)' onmouseout='clearProps()'>");
			$("<div class='projectrowname'>" + projname + "</div>").appendTo($row);
			var $buttons = $("<div class='projectbuttons'>");
			$("<button type='button' class='projectrowbutton' data-projid='" + projid + "' onclick='openProject(this)'>open</button>").appendTo($buttons);
			$("<button type='button' class='projectrowbutton' data-projid='" + projid + "' data-project='" + projectStr + "' onclick='removeProject(this)'>delete</button>").appendTo($buttons);

			$buttons.appendTo($row);
			$row.appendTo("#projects");

		});
	});
}


function addLayer() {
	/**
	* Add a new layer and a layer treenode
	*/
	if (selectednode != null && selectednode.type == 'Project') {
		//var viewnum = views.indexOf(activeobject)+1;
		var childlayers = stage.getLayers().toArray();
		var nameindex = 1;
		var nameused = true;
		while (nameused == true) {
			nameused = false;
			for (var i = 0; i < childlayers.length; i++) {
				child = childlayers[i];
				if (child.name() == 'layer' + nameindex.toString()) { nameused = true; }
			}
			if (nameused == true) { nameindex++; }

		}
		var layername = 'layer' + nameindex.toString();
		layerstate = { name: layername, type: 'Layer', id: 'none' };
		layer = createLayer(layerstate);  // create and make active layer
		actlayer = layer.getAttr('actionlayer');

		if (objSelector == null) {
			objSelector = new objectSelector();
		}
		else {
			clearActiveObject();
		}

		layer.add(objSelector.objSelGroup);

		addTreeNode(project.id, layer.id(), layerstate);

		txLayers();
		//console.log(layer);
	}
}

function deleteLayer() {
	/**
	* Delete a layer and its objects as well as their tree nodes
	*/
	if (activeobject != null && selectednode.type == 'Layer') {
		var ans = confirm('Are you sure you want to delete this layer and its contents?');
		if (ans == true) {
			var dellayer = layer;
			var dchildren = dellayer.getChildren().toArray();
			for (var i = 0; i < dchildren.length; i++) {
				var dchild = dchildren[i];
				var id = dchild.id();
				treecontainer.jstree('delete_node', id);
				dchild.destroy();
			}

			//delete the actionlayer associated with this layer
			var alayer = dellayer.getAttr('actionlayer');
			alayer.destroyChildren();
			alayer.destroy();

			//make sure there is a blank layer left in view
			if (stage.getChildren().toArray().length > 1) {
				treecontainer.jstree('select_node', selectednode.parent);
				treecontainer.jstree('delete_node', dellayer.id());
				dellayer.destroy();
				layer = stage.getChildren().toArray()[0];
			}

			if (objSelector == null) {
				objSelector = new objectSelector();
			}
			else {
				clearActiveObject();
			}

			txLayers();
		}
	}

}

function makeObjectListOptions() {
	var objtypes = ['Rect', 'Ellipse', 'RegularPolygon', 'Star', 'Ring', 'Text', 'Line', 'PolyLine', 'CurvedArrow'];
	var htmlstr = '';
	for (var i = 0; i < objtypes.length; i++) {
		var objtype = objtypes[i];
		htmlstr = htmlstr + '<option value="' + objtype + '">' + objtype + '</option>';
	}
	return htmlstr;
}

function enableDesignButtons() {
	/**
	* Manage the activation of the buttons above the design space
	*/
	//console.log(tgroupindicator);
	if (activeobject != null) {
		var state = activeobject.getAttr('state');

		if (state.type == 'Group' && tgroupindicator == null) {
			$('#ungroupbutton').prop('disabled', false);

		}
		else {
			$('#ungroupbutton').prop('disabled', true);
		}
	}

	if (tempgroup.length > 1) {
		$('#groupbutton').prop('disabled', false);
	}
	else {
		$('#groupbutton').prop('disabled', true);
	}

	if (tgroupindicator == null) {
		$('#copybutton').prop('disabled', false);
		$('#deletebutton').prop('disabled', false);
		//$('#arrowbutton').prop('disabled',false);
	}
	else {
		$('#copybutton').prop('disabled', true);
		$('#deletebutton').prop('disabled', true);
		//$('#arrowbutton').prop('disabled',true);
	}

	$('#createbutton').prop('disabled', false);
	$('#objecttypeselect').prop('disabled', false);
	$('#multiselectbutton').prop('disabled', false);
	$('#txscrbutton').prop('disabled', false);
	$('#showallbutton').prop('disabled', false);
	$('#playlist').show();
}

function disableDesignButtons() {
	/**
	* Disable all the design buttons
	*/
	$('#copybutton').prop('disabled', true);
	$('#deletebutton').prop('disabled', true);
	//$('#arrowbutton').prop('disabled',true);
	$('#groupbutton').prop('disabled', true);
	$('#ungroupbutton').prop('disabled', true);
	$('#multiselectbutton').prop('disabled', true);
	if (layer == null) {
		$('#showallbutton').prop('disabled', true);
		$('#txscrbutton').prop('disabled', true);
		$('#createbutton').prop('disabled', true);
		$('#objecttypeselect').prop('disabled', true);
		$('#playlist').hide();
	}
	else {
		$('#showallbutton').prop('disabled', false);
		$('#txscrbutton').prop('disabled', false);
		$('#createbutton').prop('disabled', false);
		$('#objecttypeselect').prop('disabled', false);
		$('#playlist').show();
	}
}

function togMultiselect() {
	/**
	* Toggle the multiselect mode
	*/
	if (ctrlkey == false) {
		$('#multiselectbutton').css("background-color", "#bbeebb");
		ctrlkey = true;
	}
	else {
		$('#multiselectbutton').css("background-color", "#eeaa88");
		ctrlkey = false;
		clearTempGroup();
	}
}

function togShowall() {
	/**
	* show all mode that makes all objects in designspace visible with 50% opacity
	*/
	if (showall == false) {
		if (layer != null) {
			var lchildren = layer.getChildren().toArray();
			for (var lch = 0; lch < lchildren.length; lch++) {
				var lchild = lchildren[lch];
				if (lchild.name() != 'Selector') {  //get rid of selector before saving
					lchild.visible(true);
					lchild.opacity(0.5);
				}
			}
			layer.draw();
			showall = true;
			$('#showallbutton').text('restore');
		}
	}
	else {
		if (layer != null) {
			var lchildren = layer.getChildren().toArray();
			for (var lch = 0; lch < lchildren.length; lch++) {
				var lchild = lchildren[lch];
				if (lchild.name() != 'Selector') {  //get rid of selector before saving
					var state = lchild.getAttr('state');
					lchild.visible(state.visible);
					lchild.opacity(state.opacity);
				}
			}
			layer.draw();
			showall = false;
			$('#showallbutton').text('show all');
		}

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

function setCastmode() {
	castmode = $('#castaction').prop('checked');
}

function stageDims() {
	var hwratio = project.screenheight / project.screenwidth;
	var vh = sh - 4;
	var vw = sw - 4;
	var vhwratio = vh / vw;
	if (vhwratio > hwratio) {
		var stw = vw;
		var sth = Math.round(vw * hwratio);
	}
	else {
		var sth = vh;
		var stw = Math.round(vh / hwratio);
	}
	$('#designstage').height(sth);
	$('#designstage').width(stw);

	stage.width(stw);
	stage.height(sth);
	txscale = project.screenwidth / stw;

}

function screenSetup() {
	/**
	* Set up the various panels in the screen according to the screen mode and size
	*/
	var ww = $(window).width();
	var wh = $(window).height();
	$('#page').css({ 'height': Math.round(0.98 * wh).toString() + 'px' });
	$('#page').css({ 'width': Math.round(0.98 * ww).toString() + 'px' });
	var ph = $('#page').height();
	var pw = $('#page').width();
	$('#leftcolumn').css({ 'height': Math.round(1.0 * ph).toString() + 'px' });
	$('#leftcolumn').css({ 'width': Math.round(0.3 * pw).toString() + 'px' });
	$('#rightcolumn').css({ 'left': Math.round(0.3 * pw).toString() + 'px' });
	$('#rightcolumn').css({ 'height': Math.round(1.0 * ph).toString() + 'px' });
	$('#rightcolumn').css({ 'width': Math.round(0.7 * pw).toString() + 'px' });

	$('#treespace').css({ 'height': Math.round(0.5 * ph).toString() + 'px' });
	$('#designspace').css({ 'height': Math.round(0.7 * ph - 10).toString() + 'px' });
	//$('#designspace').height(Math.round(0.7*ph-10));
	$('#libpane').css({ 'height': Math.round(0.3 * ph - 110).toString() + 'px' });
	$('#actionpane').css({ 'height': Math.round(0.3 * ph - 110).toString() + 'px' });
	$('#actionpane').css({ 'width': Math.round(0.7 * pw - 2).toString() + 'px' });
	$('#propedit').css({ 'height': Math.round(0.5 * ph - 48).toString() + 'px' });
	libw = $('#libpane').width();
	libh = $('#libpane').height();
	actw = $('#actionpane').width();
	acth = $('#actionpane').height();
	sh = $('#designspace').height();
	sw = $('#designspace').width();

}

function resizeStages() {
	/**
	* Resize the stages to fit the new screen container sizes
	*/
	objstage.clear();
	objlayer.draw();
	actstage.clear();
	if (actlayer != null) {
		actlayer.draw();
	}

}

function setLayerStartState() {

	if (layer != null) {
		var layerstate = layer.getAttr('state');
		var ststateobjs = getLayerObjects(layer);
		layerstate.startstate = JSON.stringify(ststateobjs);  //only startstates of children
		layer.setAttr('state', layerstate);

	}
}

function getLayerObjects(sendlayer) {
	/**
	* Gets the child states on layer excluding selector. Returns an array of child states
	*/
	var layerstate = sendlayer.getAttr('state');

	var lchildren = sendlayer.getChildren().toArray();
	objstatearr = [];
	for (var lch = 0; lch < lchildren.length; lch++) {
		var lchild = lchildren[lch];
		if (lchild.name() != 'Selector') {  //ignore selector
			var childstate = lchild.getAttr('state');
			objstatearr.push(childstate);
		}
	}
	return objstatearr;

}

function txStartViews(startviews) {
	/**
	* Sends the start states of layers in the views attached to the startevent to the screens that are listening for their names e.g.screen1
	* Receives the startviews object from from presentscreen
	*/
	// console.log("txStartViews");
	// console.log(startviews);
	var affectedlayers = [];
	if (stage != null && layer != null) {
		for (var pei = 0; pei < startviews.length; pei++) {
			var peview = startviews[pei];
			var scrname = peview.viewstate.name;
			var layerid = peview.layerid;
			if (layerid != 'none') {
				var sendlayer = stage.find('#' + layerid)[0];
				if (sendlayer != null) {
					affectedlayers.push(sendlayer);
					var layerstate = sendlayer.getAttr('state');
					var startstate = JSON.parse(layerstate.startstate);
					// console.log(sendlayer);
					// console.log(layerstate);
					// console.log(startstate);
					var screenstate = { screenwidth: project.screenwidth, screenheight: project.screenheight, txscale: txscale, viewstate: peview.viewstate, layerchildren: startstate, layeractions: [] };
					var scrcommand = { view: scrname, scrtxmsg: { command: 'update', info: screenstate } };
					var scrjson = JSON.stringify(scrcommand);
					socket.emit('screenmsg', scrjson);

				}
			}
		}
		setTimeout(function () {	//delay to allow screenmesgs to go
			//set layers to start startstates
			for (var li = 0; li < affectedlayers.length; li++) {
				var aflayer = affectedlayers[li];
				var sstate = JSON.parse(aflayer.getAttr('state').startstate);
				if (sstate != null) {
					for (var k = 0; k < sstate.length; k++) {
						var objstate = sstate[k];
						var obj = aflayer.find('#' + objstate.id)[0];
						if (obj != null) {
							//console.log(obj,objstate);
							if (objstate.type == 'Group') {
								updateGroupState(obj, objstate);
							}
							else {
								updateState(obj, objstate);
							}
						}
					}
					aflayer.draw();
				}
			}
		}, 500);
	}

}

function txViews(pevindex) {
	/**
	* Sends the present event state to the screens that are listening for their names e.g.screen1
	* Receives the presentevent index from presentscreen
	*/
	// console.log("txViews");
	// console.log(pevindex);
	if (stage != null && layer != null) {
		var pevstate = eventliststates[pevindex];
		console.log("pevstate");
		console.log(pevstate);
		var peviews = pevstate.peviews;
		for (var pei = 0; pei < pevstate.peviews.length; pei++) {
			var peview = peviews[pei];
			var scrname = peview.viewstate.name;
			var layerid = peview.layerid;
			if (layerid != 'none') {
				var sendlayer = stage.find('#' + layerid)[0];
				var actionlayer = sendlayer.getAttr('actionlayer');
				var pevactions = peview.actions;
				//console.log(pevactions);
				actionstatearr = [];
				for (var ai = 0; ai < pevactions.length; ai++) {
					var actid = pevactions[ai].id;
					var act = actionlayer.find('#' + actid)[0];
					var actstate = act.getAttr('state');
					actionstatearr.push(actstate);
				}
				var layerobjs = getLayerObjects(sendlayer);
				var screenstate = { screenwidth: project.screenwidth, screenheight: project.screenheight, txscale: txscale, viewstate: peview.viewstate, layerchildren: layerobjs, layeractions: actionstatearr };
				var scrcommand = { view: scrname, scrtxmsg: { command: 'update', info: screenstate } };
				var scrjson = JSON.stringify(scrcommand);
				socket.emit('screenmsg', scrjson);
			}
		}

	}

}

function findPELayer(layerid, layerstates) {
	/**
	* Called by compileViews to find a layer in a layerstates list
	*/
	var found = false;
	var i = 0;
	var index = -1;
	while (found == false && i < layerstates.length) {
		if (layerid == layerstates[i].layerid) {
			found = true;
			index = i;
		}
		i = i + 1;
	}
	return index;
}

function findobjinPELayer(objid, layerobjstates) {
	/**
	* Called by compileViews to find an object layer in a layerstate list
	*/
	var found = false;
	var i = 0;
	var index = -1;
	while (found == false && i < layerobjstates.length) {
		if (objid == layerobjstates[i].id) {
			found = true;
			index = i;
		}
		i = i + 1;
	}
	return index;
}

function findLayerImages(objstates) {
	/**
	* Finds all image objects on a layer
	*/
	imgobjs = [];
	for (var chi = 0; chi < objstates.length; chi++) {
		var obj = objstates[chi];
		if (obj.type == 'Group') {
			var children = obj.children;
			findLayerImages(children);
		}
		else {
			if (obj.type == 'Image') {
				imgobjs.push(obj);
			}
		}

	}
	return imgobjs;
}

function compileViews() {
	var pelayerobjstates = [];  // snapshot state of objects and actions on each layer on start of each presentevent
	var playimages = [];
	if (stage != null && layer != null) {
		var layers = stage.getLayers().toArray();

		//snapshot at start presentevent taken from layer startstates
		var layerstates = [];
		for (var li = 0; li < layers.length; li++) {
			var stlayer = layers[li];
			var layerstate = stlayer.getAttr('state').startstate;
			//console.log(layerstate);
			if (layerstate == null) {
				alert('layer startstates are not defined');
				return;
			}
			var layerobjs = JSON.parse(layerstate);
			//if the objects are image objects we need to package the image resources as well and change the image paths

			var playimgs = findLayerImages(layerobjs);
			//console.log(playimgs);
			for (var imn = 0; imn < playimgs.length; imn++) {
				var imgobj = playimgs[imn];
				var imgfilename = (imgobj.path).substring((imgobj.path).lastIndexOf("/") + 1, (imgobj.path).length);
				imgobj.path = 'playlists/' + project.name + '/images/' + imgfilename;
				playimages.push(imgfilename);
			}

			var lstate = { layerid: stlayer.id(), objstates: layerobjs, layeractions: [] };  //objstates are object states and layeractions are action definitions/states for each action applied on that presentevent
			layerstates.push(lstate);
		}
		pelayerobjstates.push(layerstates);
		// snapshots for each presentevent following first one
		for (var pevindex = 0; pevindex < eventliststates.length; pevindex++) {
			if (pevindex < eventliststates.length - 1) {
				var origlayerobjstate = JSON.stringify(pelayerobjstates[pevindex]);
				var newlayerobjstate = JSON.parse(origlayerobjstate);			//clone layerstates from previous one
			}
			var layerstates = [];
			var pevstate = eventliststates[pevindex];
			var peviews = pevstate.peviews;
			for (var pei = 0; pei < pevstate.peviews.length; pei++) { //get actions for the event
				var peview = peviews[pei];
				var scrname = peview.viewstate.name;
				var layerid = peview.layerid;
				if (layerid != 'none') {
					var sendlayer = stage.find('#' + layerid)[0];
					var actionlayer = sendlayer.getAttr('actionlayer');
					var pevactions = peview.actions;
					//console.log(pevactions);
					actionstatearr = [];
					for (var ai = 0; ai < pevactions.length; ai++) {
						var actid = pevactions[ai].id;
						var act = actionlayer.find('#' + actid)[0];
						var actstate = act.getAttr('state');
						actionstatearr.push(actstate);
					}
					var layerind = findPELayer(layerid, pelayerobjstates[pevindex]);
					(pelayerobjstates[pevindex][layerind]).layeractions = actionstatearr;  //add actionstates for layer

					//get obj states at start of presentevent from previous snapshot and evolve states
					//only up to penultimate PE as next start state evolves from current one
					if (pevindex < eventliststates.length - 1) {

						//now apply actions to applicable objects in layer to get new layerstate snapshot

						var newlayerobjs = newlayerobjstate[layerind].objstates;
						for (var lai = 0; lai < actionstatearr.length; lai++) {
							var astate = actionstatearr[lai];
							var objind = findobjinPELayer(astate.parentobjectid, newlayerobjs);
							if (objind != -1) {
								var objstate = newlayerobjs[objind];
								var prop = actiontypes[astate.actiontype];
								if (prop == 'position') {
									objstate.x = astate.endstate.x;
									objstate.y = astate.endstate.y;
								}
								else {
									objstate[prop] = astate.endstate;
								}
							}
						}
					}

				}

			}
			if (pevindex < eventliststates.length - 1) {
				//console.log(newlayerobjstate);
				pelayerobjstates.push(newlayerobjstate);  //add new objectstates for next PE to snapshots
			}
		}
		//console.log(playimages);

		var compiledViews = { screenwidth: project.screenwidth, screenheight: project.screenheight, txscale: txscale, layersnapshots: pelayerobjstates, pestates: eventliststates, playimages: playimages };
		var playlist = JSON.stringify(compiledViews);
		console.log('playlist length=' + playlist.length);
		$.ajax({
			url: hostaddr + "/saveplaylist",
			type: "POST",
			data: { projectname: project.name, playlist: playlist }
		})
			.done(function (resp) {
				//alert( "success" );
				//console.log(resp);
			})
			.fail(function () {
				alert("error");
			})
			.always(function () {
				//alert( "complete" );
			});

	}


}

function txReady(readystatus) //readystatus : newready or openready or notready
{
	var msg = JSON.stringify({
		command: 'designready',
		info: readystatus,
		project: {
			id: project.id,
			name: project.name,
			creator: project.creator,
			type: 'Project',
			createdate: project.createdate,
			lastdate: project.lastdate,
			screenwidth: project.screenwidth,
			screenheight: project.screenheight
		}
	});
	socket.emit('designmsg', msg);
}

function txLayers() {
	/**
	* Sends the layer info as an array of {layerid:id,layername:name}
	*/
	var layerinfo = [];
	var layers = stage.getLayers().toArray();
	for (var i = 0; i < layers.length; i++) {
		var layerid = layers[i].id();
		var layername = layers[i].name();
		layerinfo.push({ layerid: layers[i].id(), layername: layers[i].name() });
	}

	var msg = JSON.stringify({ command: 'layerinfo', info: layerinfo });
	socket.emit('designmsg', msg);


}


function txPEinfo() {
	var msg = JSON.stringify({ command: 'peinfo', info: { evl: eventliststates, sev: project.starteventviews, groups: project.groups } });
	socket.emit('designmsg', msg);
}

function txupdateAllEventListActions(pestates) {
	var msg = JSON.stringify({ command: 'updateAllPEventActions', info: pestates });
	socket.emit('designmsg', msg);
}
/*
function txLayerActions(actionobj,playlist) {

// Sends the actions that are played to the active view and layer
// The screen number is found from the view index of the active stage


	if (stage != null && layer != null) {
		var astate = actionobj.getAttr('state');
		var scrname = astate.viewname;
		var layername = layer.name();
		var scrcommand = {view:scrname,scrtxmsg:{command:'action',info:playlist}};
		var scrjson = JSON.stringify(scrcommand);
		socket.emit('screenmsg', scrjson);

	}
}
*/

function ioUpdate(respdata) {
	// console.log(respdata);
	var viewcommand = JSON.parse(respdata);
	var command = viewcommand.command;

	// console.log(viewcommand);
	switch (command) {
		case 'updateEventArr':
		eventliststates = viewcommand.info.pel;
			project.starteventviews = viewcommand.info.sev;
			project.groups = viewcommand.info.groups;
			// console.log("updateEventArr");
			// console.log(project);
			updateEventSwimList();
		break;

		case 'deleteEventList':
			var ind = viewcommand.info;
			deleteEventList(ind);
		break;

		case 'checkDesignScreen':
			console.log("checkDesignScreen");
			console.log(projectopened);
			console.log(layer);
			if (projectopened == true && layer != null) {
				txReady('openready');
			} else if (projectopened == false && layer != null) {
				deleteAllEventLists();
				txReady('newready');
			} else {
				deleteAllEventLists();
				txReady('notready');
			}
		break;

		case 'getLayerinfo':
			txLayers();
		break;

		case 'playPE':
			var ind = viewcommand.info;
			playPEEvents(ind);
		break;

		case 'startPE':
			var ind = viewcommand.info;
			startPEEvents(ind);
		break;

		case 'getPEinfo':
			txPEinfo();
		break;

		case 'castPEinfo':
			var ind = viewcommand.info;
			txViews(ind);
		break;

		case 'castStartinfo':
			var startviews = viewcommand.info;
			txStartViews(startviews);
		break;

		case "clickEvent":
			// data.info will be eventId to trigger.
			txClickEvent(viewcommand.info);
		break;
	}
}


function txClickEvent(eventId) {

	var eventIdx = findEventById(eventId);

	// console.log("Event " + eventId + " has index " + eventIdx);

	if (eventIdx == undefined || eventIdx < 0) {
		return;
	}

	// console.log("txViews / playPEEvents for Index " + eventIdx);

	// Send views
	txViews(eventIdx);

	// Send events
	setTimeout(function() {
		playPEEvents(eventIdx);
	}, 250);

	// Play
	setTimeout(function() {

		var pevstate = eventliststates[eventIdx];
		// console.log("pevstate");
		// console.log(pevstate);

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
	}, 500);
}


function findEventById(eventId) {
	// console.log("findEventById: looking for event index for ID " + eventId);
	// console.log(eventliststates);
	indexes = $.map(eventliststates, function(obj, idx) {
		// console.log(obj);
		if (obj.id == eventId) {
			return idx;
		}
	});
	return indexes[0];
}


/**
 * Initial set up
 *
 */
function setup() {

	if (USEIO) {
		socket = io(serverurl);
		socket.on('updateEvents', function(respdata) {
			//console.log(respdata);
			ioUpdate(respdata);
		});
	}

	coreSetup();
	// Tabs  - thanks Seb Kay http://inspirationalpixels.com/tutorials/creating-tabs-with-html-css-and-jquery
	$('.tabs .tab-links a').on('click', function (e) {
		var currentAttrValue = $(this).attr('href');

		// Show/Hide Tabs
		$('.tabs ' + currentAttrValue).show().siblings().hide();

		// Change/remove current tab to active
		$(this).parent('li').addClass('active').siblings().removeClass('active');

		e.preventDefault();
		screenSetup();
		resizeStages();
	});

	screenSetup();
	var hwratio = project.screenheight / project.screenwidth;
	var vh = sh - 4;
	var vw = sw - 4;
	var vhwratio = vh / vw;
	if (vhwratio > hwratio) {
		var stw = vw;
		var sth = Math.round(vw * hwratio);
	}
	else {
		var sth = vh;
		var stw = Math.round(vh / hwratio);
	}
	$('#designstage').height(sth);
	$('#designstage').width(stw);

	stage = new Kinetic.Stage({
		container: designstage,
		id: 'stage0',
		name: 'designstage',
		width: stw,
		height: sth
	});

	//	console.log(vh,vw,sth,stw);
	//setup objlist
	objstage = new Kinetic.Stage({
		container: libpane,
		name: 'objscreen',
		width: libw - 10,
		height: libh - 10
	});
	objlayer = new Kinetic.Layer({ name: "objlayer" });
	objstage.add(objlayer);
	//librarylist selector
	objlayer.add(libselector);

	loadObjects('all');
	objlayer.draw();

	//setup actionlist
	actstage = new Kinetic.Stage({
		container: actionpane,
		name: 'actscreen',
		width: actw - 10,
		height: acth - 10
	});
	$('#castaction').prop('checked', castmode);


	//smartmenus
	$(function () {
		$('#treemenu').smartmenus({
			subMenusMinWidth: '80px',
			subMenusMaxWidth: '150px',
			noMouseOver: true
		});
	});


	//jstree
	treecontainer = $('#tree');
	$(function () { treecontainer.jstree(); });
	changeCallback = updateObjStateandTree;

	$('#objecttypeselect').empty();
	$('#objecttypeselect').append(makeObjectListOptions());

	disableDesignButtons();
	$('#multiselectbutton').css("background-color", "#eeaa88");
	togShowall();



	document.addEventListener("fullscreenchange", function () {
		screenSetup();
		resizeStages();
		stageDims();
	}, false);

	document.addEventListener("mozfullscreenchange", function () {
		screenSetup();
		resizeStages();
		stageDims();
	}, false);

	document.addEventListener("webkitfullscreenchange", function () {
		screenSetup();
		resizeStages();
		stageDims();
	}, false);

	screenSetup();
	resizeStages();
	stageDims();

	$('#treespace').resizable({
		// only use the southern handle
		handles: 's',
		// restrict the height range
		minHeight: 50,
		maxHeight: 600,
		// resize handler updates the content panel height
		resize: function (event, ui) {
			var currentHeight = ui.size.height;

			// this accounts for padding in the panels +
			// borders, you could calculate this using jQuery
			var padding = 12;

			// this accounts for some lag in the ui.size value, if you take this away
			// you'll get some instable behaviour
			$(this).height(currentHeight);

			// set the tree panel height
			var containerHeight = $('#leftcolumn').height();
			var menuHeight = $('#treemenu').height();
			$("#propedit").height(containerHeight - menuHeight - currentHeight - padding);
		}
	});

	$('#designspace').resizable({
		// only use the southern handle
		handles: 's',
		// restrict the height range
		minHeight: 50,
		maxHeight: 650,
		// resize handler updates the content panel height
		resize: function (event, ui) {
			var currentHeight = ui.size.height;

			// this accounts for padding in the panels +
			// borders, you could calculate this using jQuery
			var padding = 1;

			// this accounts for some lag in the ui.size value, if you take this away
			// you'll get some instable behaviour
			$(this).height(currentHeight);

			//$('.tab').height(currentHeight-52);

			// set the design panel height
			var containerHeight = $('#rightcolumn').height();
			var menuHeight = $('#menu').height();
			var tabpaneHeight = containerHeight - menuHeight - currentHeight - padding;
			$(".tabs").height(tabpaneHeight);
			$('#libpane').height(tabpaneHeight - 80);
			$('#actionpane').height(tabpaneHeight - 80);
			libh = $('#libpane').height();
			acth = $('#actionpane').height();
			sh = $('#designspace').height();
			stageDims();
			if (stage != null) {
				stage.clear();
				if (layer == null) {
					layer = stage.getLayers()[0];
				}
				layer.draw();
				var id = layer.id();
				treecontainer.jstree('select_node', id);

			}

		}
	});

	$(window).focus(function () {
		if (stage != null) {
			stage.clear();
			if (layer != null) {
				layer.draw();
			}
		}
	});

}
