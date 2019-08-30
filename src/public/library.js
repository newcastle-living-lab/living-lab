
// Current path that the file explorer has been navigated to.
// This is retrieved when uploading a file to pass to the server.
var currentPath = null;

/**
* Upload a file selected with an input file type element id="fimg" and do an ajax post to nodeio which will save it in the appropriate directory
*
*/
function uploadFile() {

	var fdata = new FormData();
	var fileid = document.getElementById("fimg");
	var files = fileid.files;

	// Set path first, so the server processes the path first.
	fdata.set('path', currentPath);

	for (var i = 0; i < files.length; i++) {
		fdata.append("imgfiles", files[i]);
	}

	$.ajax({
		url: hostaddr+"/uploadresource",
		type: "POST",
		data: fdata,
		processData: false,  // tell jQuery not to process the data
		contentType: false, // tell jQuery not to set contentType
	})
	.done(function() {
		$(document).trigger('fx:uploaded');
	})
	.fail(function() {
		alert('Error uploading file.');
	})
	.always(function() {
		// Reset the file input
		document.getElementById("fimg").value = '';
	});

}


/**
 * Draw the library object that is selected in the library pane on the active layer
 *
 */
function libuse() {
	var state = activelibobj.getAttr('state');
	if (state.type == 'Group') {
		var childarr = state.children;
		for (var i=0;i<childarr.length;i++) {
			var childstate = childarr[i];
			var obj = newobj(true,childstate);
			layer.add(obj);
		}
	} else {
		var obj = newobj(true,state);
		layer.add(obj);
	}
	layer.draw();
}


/**
 * Remove a library object from the database by making an ajax call to nodeio
 *
 */
function libremove() {

	clearObjects();

	var ans = confirm('Are you sure you want to remove the object?');

	if (ans == true) {
		var objid = activelibobj.getAttr('id');
		$.ajax({
			url: hostaddr+"/removelibobj",
			type: "GET",
			data: {id:objid}
		})
		.done(function() {
			//alert( "success" );
			loadObjects('all');
		})
		.fail(function() {
			alert( "error" );
		})
		.always(function() {
			//alert( "complete" );
		});
	}
}


/**
 * Only load the library object which match the filter string
 *
 */
function filterlib() {
	var filterstr = document.getElementById('filtername').value;
	clearObjects();
	loadObjects(filterstr);
}


/**
 * Load all the library objects
 *
 */
function resetlib() {
	clearObjects();
	loadObjects('all');
}


/**
 * The callback function from the resource icon which sets the image object source to the resource that is clicked on
 *
 */
function setToResource(data) {

	// console.log(data);

	if (activeobject != null) {

		selectedresource = data.filename;
		var state = activeobject.getAttr('state');

		switch (state.type) {

			case 'Image':

				var img = new Image();
				img.onload = function() {
					var H = this.height,
						W = this.width;
					//console.log(H,W);
					state.path = selectedresource;
					state.width = W;
					state.height = H;
					activeobject.setAttr('state',state);
					activeobject.getImage().src = selectedresource;
					activeobject.width(W);
					activeobject.height(H);
					updateState(activeobject,{path:state.path,width:state.width,height:state.height});
					layer.draw();
					document.getElementById('addlibbox').style.visibility = 'hidden';
					updatePropDisp(activeobject);
				}
				// console.log(selectedresource);
				img.src = selectedresource;

			break;

			case 'Audio':
				state.src = selectedresource;
				activeobject.setAttr('state', state);
				updateState(activeobject, { src: selectedresource });
				layer.draw();
				updatePropDisp(activeobject);
			break;

		}
	}
}


/**
 * Show or Hide the Delete Resource button.
 * If data is not false, show.
 * If data is false, hide.
 *
 */
function showDeleteFile(data) {

	$deleteContainer = $("#delete_resource");
	$deleteContainer.empty();

	if (data === false) {
		return;
	}

	var $button = $("<button>", {
		'type': 'button',
		'class': 'delete_btn',
	});
	$button.text("Delete resource");
	$button.on("click", function(e) {
		fileRemove(data);
	});
	$button.appendTo($deleteContainer);

}


/**
 * Prompt user to delete resource, do AJAX POST on confirm.
 *
 */
function fileRemove(data) {

	console.log(data);

	var ans = confirm('Are you sure you want to delete the selected file "' + data.name + '"?');

	if ( ! ans) {
		return;
	}

	$.ajax({
		url: hostaddr + "/removeresource",
		type: "POST",
		data: {
			filename: data.path
		}
	})
	.success(function() {
		$(document).trigger('fx:deleted', data.id);
	})
	.fail(function() {
		alert('Error deleting the file');
	});

}


/**
 * add the button which saves the objects on the layer to the library
 *
 */
function prepareforlib() {
	activebutton = 'prepareforlib';
	var numobj = checknumObjects();
	if (numobj>0) {  //make sure there are some objects
		//console.log(numobj);
		if (numobj>1) {  //if it is a group
			activeobject = null;
			updatePropDisp();
			document.getElementById('addlibbox').style.visibility = 'visible';
		} else {
			if (activeobject != null) {  // if only one object then make sure it is selected and exists
				updatePropDisp();
				document.getElementById('addlibbox').style.visibility = 'visible';
			}
		}
	}
}


/**
 * Add the object or group of objects to the library database as a library object
 *
 */
function addLibObj() {

	document.getElementById('addlibbox').style.visibility = 'hidden';

	var selector = layer.find('.Selector')[0];//do not include objectselector
	if (selector != null) {
		selector.remove();
	}
	var desobjects = (layer.getChildren()).toArray();
	numobj = desobjects.length;
	//console.log(numobj.toString());


	if (numobj > 0) {
		// make sure there is something to save

		if (numobj == 1) {

			//if single object get rid of its offset and prepare its state
			var obj = desobjects[0];
			var state = obj.getAttr('state');
			//decouple from objectstate
			var cobjstate = JSON.parse(JSON.stringify(state));
			var objextents = getobjextents(obj);
			cobjstate.x = cobjstate.x-objextents.minx;
			cobjstate.y = cobjstate.y-objextents.miny;
			var designobject = {name:cobjstate.name,type:cobjstate.type,jsonstate:JSON.stringify(cobjstate)};

		} else {

			//if it is a number of objects find the extent of the objects and define it as a group object
			var childstatearr = new Array();
			var gxmin = 100000; //group width and height
			var gxmax = 1;
			var gymin = 100000;
			var gymax = 1;
			for (var i=0;i<numobj;i++) {
				var obj = desobjects[i];
				//console.log(obj.getAttr('state'));
				var objstate = obj.getAttr('state');
				if (objstate.type != 'Group') {  //dont add group object if present
					//decouple from objectstate
					var cobjstate = JSON.parse(JSON.stringify(objstate));
					childstatearr.push(cobjstate);
					var objextents = getobjextents(obj);
					//console.log(objextents);
					if (objextents.maxx > gxmax) { gxmax = objextents.maxx;} //include objects
					if (objextents.maxy > gymax) { gymax = objextents.maxy;}
					if (objextents.minx < gxmin) { gxmin = objextents.minx;}
					if (objextents.miny < gymin) { gymin = objextents.miny;}
				}
			}

			var w = gxmax-gxmin;
			var h = gymax-gymin;
			// remove group xy offset from objects
			for (var i=0;i<childstatearr.length;i++) {
				childstate = childstatearr[i];
				childstate.x = childstate.x-gxmin;
				childstate.y = childstate.y-gymin;
				childstatearr[i] = childstate;
			}

			var groupstate = {name:designgroup.name,id:'none',type:'Group',x:0,y:0,width:w,height:h,visible:true,opacity:1.0,children:childstatearr};
			var gstate = JSON.stringify(groupstate);
			var designobject = {name:designgroup.name,type:designgroup.type,jsonstate:gstate};
		}

		// send the object to the library database with an ajax call to nodeio
		$.ajax({
			url: hostaddr+"/addlibobj",
			type: "GET",
			data: {
				"name": designobject.name,
				"type": designobject.type,
				"jsonstate": designobject.jsonstate
			}
		})
		.done(function() {
			//alert( "success" );
			clearObjects();  //refresh the library pane so new object is shown
			loadObjects('all');
			objlayer.draw();
		})
		.fail(function() {
			alert( "error" );
		})
		.always(function() {
			//alert( "complete" );
		});
	}
}


function selectObject(source) {
	var obj = null;
	if (activeobject != null) {
		layer = activeobject.getLayer();
		stage = layer.getStage();
		var id = activeobject.id();
		//console.log(id);
	}
}


function delObject() {
	if (activeobject != null) {
		var ans = confirm('Are you sure you want to delete this object?');
		if (ans == true) {
			delobj();
		}
	}
}


/**
 * Updates the state attribute of the active object
 * Called by updatePropDisp() in llcore
 * This calls the updateState functions in llcore.js depending on the type
 *
 */
function updateObjState(prop) {
	updateState(activeobject,prop);
}


/**
 * Set up the screen panes according to the screen size and enable resizing
 *
 */
function screenSetup() {

	var ww = $(window).width();
	var wh = $(window).height() - 20;
	$('#mainpanel').css({'height': Math.round(1.0*wh).toString() + 'px'});
	$('#mainpanel').css({'width': Math.round(0.70*ww).toString() + 'px'});
	//	$('#resourcepanel').css({'left': Math.round(0.25*ww).toString() + 'px'});
	$('#resourcepanel').css({'height': Math.round(1.0*wh).toString() + 'px'});
	$('#resourcepanel').css({'width': Math.round(0.27*ww).toString() + 'px'});
	var rh = $('#resourcepanel').height();
	$('#iconlist').css({'height': Math.round(1.0*rh-100-5).toString() + 'px'});

	var mh = $('#mainpanel').height();
	var mw = $('#mainpanel').width();
	$('#designpanel').css({'height': Math.round(0.6*mh-4).toString() + 'px'});
	var dh = $('#designpanel').height();
	var dw = $('#designpanel').width();
	$('#designspace').css({'height': Math.round(1.0*dh).toString() + 'px'});
	$('#designspace').css({'width': Math.round(0.6*dw-4).toString() + 'px'});
	$('#propertypanel').css({'height': Math.round(1.0*dh-15).toString() + 'px'});
	$('#propertypanel').css({'width': Math.round(0.4*dw-15).toString() + 'px'});
	$('#objectlist').css({'height': Math.round(0.4*mh-155).toString() + 'px'});
	libw = $('#objectlist').width();
	libh = $('#objectlist').height();

}


/**
 * resize the stage according to screen size when full screen or resizing
 *
 */
function resizeStages() {
	objstage.width(libw-10);
	objstage.height(libh-10);
}


/**
 * Initial setup of the stages and layers and event listeners
 */
function setup() {

	screenSetup();

	var sw = $('#designspace').width();
	var sh = $('#designspace').height();

	// When a folder is navigated to
	$(document).on('fx:navigate', function(evt, params) {
		// store the path we are currently in
		currentPath = params;
		// hide Delete button
		showDeleteFile(false);
	});

	// When a file is selected
	$(document).on('fx:select', function(evt, params) {
		// Show Delete button
		showDeleteFile(params);
		// Set file to resource
		setToResource(params);
	});

	var fileExplorer = new FileExplorer('#iconlist', hostaddr);

	stage = new Konva.Stage({
		container: designspace,
		name:'designscreen',
		width: sw,
		height: sh
	});

	layer = new Konva.Layer({name:"designlayer"});
	stage.add(layer);
	objSelector = new objectSelector();
	layer.add(objSelector.objSelGroup);
	//layer.draw();

	$(stage.getContent()).on('click', function() {
		if (cursorstate == 'free') {
			if (activeobject != null) {
				objSelector.deleteOldSelector();
				activeobject = null;
				$("#proptable").empty();
			}
		}
	});

	//setup objlist
	objstage = new Konva.Stage({
		container: objectlist,
		name:'objscreen',
		width: libw,
		height: libh
	});
	objlayer = new Konva.Layer({name:"objlayer"});
	objstage.add(objlayer);
	coreSetup();
	objlayer.add(libselector);

	loadObjects('all');
	document.getElementById('addlibbox').style.visibility = 'hidden';
	objlayer.draw();

	changeCallback = updateObjState;  //define property change callback

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

}
