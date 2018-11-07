var hostaddr = 'http://' + window.location.hostname + ':' + window.location.port;
var stage = null; //active stage
var layer = null;  //active layer
var objstage = null;
var objlayer = null;
var libselector = null;
var designgroup = { name: 'none', type: 'Group' }; //this is a group of one to many objects present on the design space
var activeobject = null;
var objwh = 64;  // library 'icon' width and height
var libw = 800;
var libh = 500;
var activebutton = 'select';
var activelibobj = null;
var ctrlkey = false;
var tgroupindicator = null;  //marks objects selected as a group
var tempgroup = new Array(); //holds objects selected as a group
var changeCallback = null;  // function called by property inspector when a value changes
var defcolour = '#aaaacc';
var defstroke = '#000000';
var defstrokewidth = 2;
var dashdef = [10, 5];
var usedefaults = true;
var objdefaults = {};

hostaddr = hostaddr.replace(/:$/, '');

function UniqueId() {
	/**
	* Generate a random id for the object
	*/
	var unum = Math.floor((1 + Math.random()) * 0x10000);
	var unumstr = unum.toString(16);
	//console.log(unumstr);
	return unumstr;

}

function uniqueNameonLayer(obj) {
	/**
	* Generate a unique name related to the object type
	*/
	//var objlayer = obj.getLayer();
	var objlayer = layer;
	var layerchildren = objlayer.getChildren().toArray();
	var state = obj.getAttr('state');

	var namearr = new Array();
	for (var i = 0; i < layerchildren.length; i++) {
		var cobj = layerchildren[i];
		//console.log(cobj);
		if (cobj.name() != 'Selector' && cobj.name() != 'groupindicator') {
			var cstate = cobj.getAttr('state');
			namearr.push(cstate.name);
		}
	}
	//use existing name or give it type one if none
	if (state.name == 'none' || state.name == '') {
		var objname = state.type.toLowerCase();
	}
	else {
		var objname = state.name;
	}

	var nameindex = namearr.indexOf(objname);
	if (nameindex == -1) {  //name
		tryname = objname;
	}
	else {
		var id = layerchildren[nameindex].id();
		if (id == obj.id()) {  //then use same name
			tryname = objname;
		}
		else {  //add a number
			var namenum = 0;
			var same = true;
			while (namenum < 1000 && same) {
				var tryname = objname + namenum.toString();

				if (namearr.indexOf(tryname) == -1) {
					same = false;
				}
				else {
					namenum = namenum + 1;
				}
			}
		}
	}
	//console.log(tryname);
	return tryname;
}


function clearActiveObject() {
	/**
	* Delete the object selector and make the activeobject null
	*/
	if (activeobject != null) {
		if (objSelector != null) { objSelector.deleteOldSelector(); }
		activeobject = null;
		$("#proptable").empty();
	}
}



function makelistobj(id, objjsonstate, xpos, ypos) {
	/**
	* draw a library object on the library pane
	* display name of library object under icon
	* highlight object with the libselector when clicked
	*/
	var tspace = 10;
	var newobjstate = objjsonstate;
	var obj = null;
	//console.log(objjsonstate);
	var libobj = new Konva.Rect({
		draggable: false,
		x: xpos,
		y: ypos,
		width: objwh,
		height: objwh - tspace,
		fillAlpha: 1
	});

	if (newobjstate.type == 'Group') {
		obj = newgroupobj(false, false, newobjstate);
	}
	else {
		obj = newobj(false, newobjstate);
	}
	// add id for database manipulation
	libobj.setAttr('id', id);
	libobj.setAttr('state', objjsonstate);
	//console.log(id);

	var objextents = getobjextents(obj);
	var w = objextents.maxx - objextents.minx;
	var h = objextents.maxy - objextents.miny;
	if (w > h) {
		var scale = objwh / w;
	}
	else {
		var scale = (objwh - tspace) / h;
	}

	obj.scale({ x: scale, y: scale });
	var xp = xpos + scale * obj.x();
	var yp = ypos + scale * obj.y();
	obj.x(xp);
	obj.y(yp);

	var displaystr = (obj.getAttr('name')).slice(0, 10);
	//console.log(obj.getAttr('name'));
	var nameobj = new Konva.Text({
		name: 'objname',
		draggable: false,
		x: xpos + 5,
		y: ypos + objwh - tspace,
		text: displaystr,
		fontSize: 12,
		fill: 'black'

	});
	objlayer.add(libobj);
	objlayer.add(obj);
	objlayer.add(nameobj);
	nameobj.moveToTop();
	libobj.moveToTop();
	objlayer.draw();

	libobj.on('mouseover', function () {
		document.body.style.cursor = 'pointer';
		cursorstate = 'onobj';
	});

	libobj.on('mouseout', function () {
		document.body.style.cursor = 'default';
		cursorstate = 'free';
	});

	libobj.on('mousedown', function () {
		libselector.x(xpos);
		libselector.y(ypos);
		libselector.setAttr('visible', true);
		objlayer.draw();
		activelibobj = this;
	});



}

function clearObjects() {
	/**
	* Clear the library pane
	*/
	var objects = (objlayer.getChildren()).toArray();
	//console.log(objects);
	for (var i = 0; i < objects.length; i++) {
		var obj = objects[i];
		if (obj.getAttr('name') != 'libselector') {
			//console.log(obj.getAttr('name'));
			obj.destroy();
		}
	}

	libselector.setAttr('visible', false);
	objlayer.clear({ x: 0, y: 0, width: libw, height: libh });
}


function loadObjects(filstr) {
	/**
	* Load the library objects with an ajax call to nodeio and call makelistobj to display them
	* display the objects in rows and columns and extend the pane if necessary
	*/

	var margin = 10;
	var xpos = margin;
	var ypos = margin;
	var row = 0;
	var col = 0;
	//console.log(objstage.getWidth());

	$.getJSON(hostaddr + "/getobjects", { filter: filstr }, function (data) {
		//var items = [];
		$.each(data, function (index, item) {
			//console.log(item.jsonstate);
			var id = (item.id).toFixed();
			var ojs = JSON.parse(item.jsonstate);
			if (((col + 1) * (objwh + margin)) > objstage.getWidth()) {
				row = row + 1;
				col = 0;
				if (((row + 1) * (objwh + margin) + margin) > objstage.height()) {
					objstage.height((row + 1) * (objwh + margin) + margin);
					//objlayer.height(objlayer.getHeight()+objwh+margin);
				}

			}
			xpos = col * (objwh + margin) + margin;
			ypos = row * (objwh + margin) + margin;
			//console.log(xpos,ypos);
			makelistobj(id, ojs, xpos, ypos);
			col = col + 1;

		});
	});

}


function getobjextents(obj) {
	/**
	*finds the extents of a rotated object
	*/

	var ang = (obj.getAttr('rotation')) * Math.PI / 180.0;
	var state = obj.getAttr('state');

	switch (state.type) {

		case 'Ring':
			var r = obj.getAttr('outerRadius');
			var topLeftx = obj.x() - r;
			var topLefty = obj.y() - r;
			var topRightx = obj.x() + r;
			var topRighty = obj.y() - r;
			var bottomLeftx = obj.x() - r;
			var bottomLefty = obj.y() + r;
			var bottomRightx = obj.x() + r;
			var bottomRighty = obj.y() + r;
			break;

		case 'Star':
			var r = obj.getAttr('outerRadius');
			var topLeftx = obj.x() - r;
			var topLefty = obj.y() - r;
			var topRightx = obj.x() + r;
			var topRighty = obj.y() - r;
			var bottomLeftx = obj.x() - r;
			var bottomLefty = obj.y() + r;
			var bottomRightx = obj.x() + r;
			var bottomRighty = obj.y() + r;
			break;

		case 'RegularPolygon':
			var r = obj.getAttr('radius');
			var topLeftx = obj.x() - r;
			var topLefty = obj.y() - r;
			var topRightx = obj.x() + r;
			var topRighty = obj.y() - r;
			var bottomLeftx = obj.x() - r;
			var bottomLefty = obj.y() + r;
			var bottomRightx = obj.x() + r;
			var bottomRighty = obj.y() + r;
			break;

		case 'Ellipse':
			var h = obj.height();
			var w = obj.width();
			var cornerRadius = Math.sqrt((h * h) / 4 + (w * w) / 4);
			var cornerang = Math.atan2(h, w);
			var topLeftx = Math.round(obj.x() + (cornerRadius * Math.cos(Math.PI - cornerang - ang)));
			var topLefty = Math.round(obj.y() - (cornerRadius * Math.sin(Math.PI - cornerang - ang)));
			var topRightx = Math.round(obj.x() + (cornerRadius * Math.cos(cornerang - ang)));
			var topRighty = Math.round(obj.y() - (cornerRadius * Math.sin(cornerang - ang)));
			var bottomLeftx = Math.round(obj.x() + (cornerRadius * Math.cos(Math.PI - cornerang + ang)));
			var bottomLefty = Math.round(obj.y() + (cornerRadius * Math.sin(Math.PI - cornerang + ang)));
			var bottomRightx = Math.round(obj.x() + (cornerRadius * Math.cos(cornerang + ang)));
			var bottomRighty = Math.round(obj.y() + (cornerRadius * Math.sin(cornerang + ang)));
			break;

		case 'Line':
			var points = obj.points();
			var ll = points[2];
			var cosang = Math.cos(ang);
			var sinang = Math.sin(ang);
			var topLeftx = obj.x();
			var topLefty = obj.y();
			var topRightx = topLeftx + Math.round(ll * cosang / 2);
			var topRighty = topLefty + Math.round(ll * sinang / 2);
			var bottomLeftx = topLeftx - Math.round(ll * sinang / 2);
			var bottomLefty = topLefty + Math.round(ll * cosang / 2);
			var bottomRightx = topLeftx + Math.round(ll * cosang);
			var bottomRighty = topLefty + Math.round(ll * sinang);
			break;

		case 'PolyLine':
			var points = obj.points();
			var xmin = 10000;
			var ymin = 10000;
			var xmax = -10000;
			var ymax = -10000;
			var cosang = Math.cos(ang);
			var sinang = Math.sin(ang);
			var x0 = points[0];
			var y0 = points[1];
			for (var i = 1; i < points.length / 2; i++) {
				var xv = points[2 * i];
				var yv = points[2 * i + 1];
				var h = yv - y0;
				var w = xv - x0;
				var ll = Math.sqrt(h * h + w * w);
				var objang = Math.atan2(h, w);
				var xp = obj.x() + Math.round(ll * Math.cos(ang + objang));
				var yp = obj.y() + Math.round(ll * Math.sin(ang + objang));
				//find max and min
				if (xmin > xp) { xmin = xp; }
				if (ymin > yp) { ymin = yp; }
				if (xmax < xp) { xmax = xp; }
				if (ymax < yp) { ymax = yp; }
			}

			var topLeftx = xmin;
			var topLefty = ymin;
			var topRightx = xmax;
			var topRighty = ymin;
			var bottomLeftx = xmin;
			var bottomLefty = ymax;
			var bottomRightx = xmax;
			var bottomRighty = ymax;
			break;

		case 'CurvedArrow':
			var p = obj.getAttr('state');
			var points = [p.x, p.y, p.midX + p.x, p.midY + p.y, p.endX + p.x, p.endY + p.y];
			//console.log(points);
			var xmin = 10000;
			var ymin = 10000;
			var xmax = -10000;
			var ymax = -10000;
			for (var i = 0; i < points.length / 2; i++) {
				var xv = points[2 * i];
				var yv = points[2 * i + 1];
				//find max and min
				if (xmin > xv) { xmin = xv; }
				if (ymin > yv) { ymin = yv; }
				if (xmax < xv) { xmax = xv; }
				if (ymax < yv) { ymax = yv; }
			}

			var h = ymax - ymin;
			var w = xmax - xmin;
			var cosang = Math.cos(ang);
			var sinang = Math.sin(ang);
			var topLeftx = obj.x();
			var topLefty = obj.y();
			var topRightx = obj.x() + Math.round(w * cosang);
			var topRighty = obj.y() + Math.round(w * sinang);
			var bottomLeftx = obj.x() - Math.round(h * sinang);
			var bottomLefty = obj.y() + Math.round(h * cosang);
			var bottomRightx = bottomLeftx + Math.round(w * cosang);
			var bottomRighty = bottomLefty + Math.round(w * sinang);

			break;

		case 'Figure':
			var points = obj.points();
			var xmin = 10000;
			var ymin = 10000;
			var xmax = -10000;
			var ymax = -10000;
			for (var i = 0; i < points.length / 2; i++) {
				var xv = points[2 * i];
				var yv = points[2 * i + 1];
				//find max and min
				if (xmin > xv) { xmin = xv; }
				if (ymin > yv) { ymin = yv; }
				if (xmax < xv) { xmax = xv; }
				if (ymax < yv) { ymax = yv; }
			}

			var h = ymax - ymin;
			var w = xmax - xmin;
			var cosang = Math.cos(ang);
			var sinang = Math.sin(ang);
			var topLeftx = obj.x() - Math.round((w / 2) * cosang);
			var topLefty = obj.y() - Math.round((w / 2) * sinang);
			var topRightx = obj.x() + Math.round((w / 2) * cosang);
			var topRighty = obj.y() + Math.round((w / 2) * sinang);
			var bottomLeftx = obj.x() - Math.round(h * sinang) - Math.round((w / 2) * cosang);
			var bottomLefty = obj.y() + Math.round(h * cosang) - Math.round((w / 2) * sinang);
			var bottomRightx = obj.x() - Math.round(h * sinang) + Math.round((w / 2) * cosang);
			var bottomRighty = obj.y() + Math.round(h * cosang) + Math.round((w / 2) * sinang);
			break;

		default:
			var h = obj.height();
			var w = obj.width();
			var cosang = Math.cos(ang);
			var sinang = Math.sin(ang);
			var topLeftx = obj.x();
			var topLefty = obj.y();
			var topRightx = obj.x() + Math.round(w * cosang);
			var topRighty = obj.y() + Math.round(w * sinang);
			var bottomLeftx = obj.x() - Math.round(h * sinang);
			var bottomLefty = obj.y() + Math.round(h * cosang);
			var bottomRightx = bottomLeftx + Math.round(w * cosang);
			var bottomRighty = bottomLefty + Math.round(w * sinang);
			break;

	}
	var minxval = Math.min(topLeftx, topRightx, bottomLeftx, bottomRightx);
	var maxxval = Math.max(topLeftx, topRightx, bottomLeftx, bottomRightx);
	var minyval = Math.min(topLefty, topRighty, bottomLefty, bottomRighty);
	var maxyval = Math.max(topLefty, topRighty, bottomLefty, bottomRighty);

	var minmax = { minx: minxval, maxx: maxxval, miny: minyval, maxy: maxyval };
	//console.log(minmax);
	return minmax;

}

function checknumObjects() {
	/**
	* get the number of design objects in design without the object selector
	*/
	var desobj = layer.getChildren();
	var numobj = desobj.length;
	var selector = layer.find('.Selector')[0];
	if (selector != null) {
		numobj = numobj - 1;
	}
	return numobj;
}

function updateGroupState(obj, prop) {
	/**
	* Update the state of a group object
	* if the group contains a symmetric object like a ring or regular polygon the scale according to height width ratio when size changes
	*/
	if (obj != null) {
		var state = obj.getAttr('state');
		var children = obj.getChildren().toArray();
		for (var propkey in prop) {
			var propval = prop[propkey];
			var hasradiustypes = false;  //if the group has radius type objects then scale height and width equally
			for (var i = 0; i < children.length; i++) {
				var childtype = children[i].getAttr('state').type;
				if (childtype == 'RegularPolygon' || childtype == 'Star' || childtype == 'Ring' || childtype == 'Figure') {
					hasradiustypes = true;
				}
			}
			state[propkey] = propval;
			if (propkey != 'type') {
				for (var i = 0; i < children.length; i++) {
					var child = children[i];
					var chstate = child.getAttr('state');
					if (propkey == 'width') {
						var xs = propval / obj.width();

						chstate.x = xs * chstate.x;
						child.x(xs * child.x());
						if (hasradiustypes) {
							chstate.y = xs * chstate.y;
							child.y(xs * child.y());
						}
						switch (chstate.type) {
							case 'Group':
								updateGroupState(child, { x: child.x(), y: child.y(), width: xs * child.width() });
								break;
							case 'RegularPolygon':
								child.radius(xs * child.radius());
								chstate.radius = child.radius();
								break;

							case 'Star':
								child.outerRadius(xs * child.outerRadius());
								child.innerRadius(xs * child.innerRadius());
								chstate.outerRadius = child.outerRadius();
								chstate.innerRadius = child.innerRadius();
								break;

							case 'Ring':
								child.outerRadius(xs * child.outerRadius());
								child.innerRadius(xs * child.innerRadius());
								chstate.outerRadius = child.outerRadius();
								chstate.innerRadius = child.innerRadius();
								break;

							case 'Line':
								var points = child.points();
								var hl = chstate.lineLength * Math.cos(Math.PI * chstate.rotation / 180.0);
								var vl = chstate.lineLength * Math.sin(Math.PI * chstate.rotation / 180.0);
								if (hasradiustypes) {
									vl = vl * xs;
								}
								chstate.lineLength = Math.sqrt(vl * vl + xs * xs * hl * hl);
								chstate.rotation = 180 * Math.atan2(vl, hl * xs) / Math.PI;
								points[2] = Math.round(chstate.lineLength);
								child.rotation(chstate.rotation);
								child.points(points);
								break;

							case 'Figure':
								var points = child.points();
								chstate.scaleSize = chstate.scaleSize * xs;
								for (var k = 0; k < points.length; k++) {
									points[k] = points[k] * xs;
								}
								chstate.points = points;
								child.points(points);
								break;

							default:
								child.width(xs * child.width());
								chstate.width = child.width();
								if (hasradiustypes) {
									child.height(xs * child.height());
									chstate.height = child.height();
								}

								break;
						}
					}
					else if (propkey == 'height') {
						var ys = propval / obj.height();
						chstate.y = ys * chstate.y;
						child.y(ys * child.y());
						if (hasradiustypes) {
							chstate.x = ys * chstate.x;
							child.x(ys * child.x());
						}
						switch (chstate.type) {
							case 'Group':
								updateGroupState(child, { x: child.x(), y: child.y(), height: ys * child.height() });
								break;
							case 'RegularPolygon':
								child.radius(ys * child.radius());
								chstate.radius = child.radius();
								break;

							case 'Star':
								child.outerRadius(ys * child.outerRadius());
								child.innerRadius(ys * child.innerRadius());
								chstate.outerRadius = child.outerRadius();
								chstate.innerRadius = child.innerRadius();
								break;

							case 'Ring':
								child.outerRadius(ys * child.outerRadius());
								child.innerRadius(ys * child.innerRadius());
								chstate.outerRadius = child.outerRadius();
								chstate.innerRadius = child.innerRadius();
								break;

							case 'Line':
								var points = child.points();
								var hl = chstate.lineLength * Math.cos(Math.PI * chstate.rotation / 180.0);
								var vl = chstate.lineLength * Math.sin(Math.PI * chstate.rotation / 180.0);
								if (hasradiustypes) {
									hl = hl * ys;
								}
								chstate.lineLength = Math.sqrt(ys * ys * vl * vl + hl * hl);
								chstate.rotation = 180 * Math.atan2(ys * vl, hl) / Math.PI;
								points[2] = Math.round(chstate.lineLength);
								child.rotation(chstate.rotation);
								child.points(points);

								break;

							case 'Figure':
								var points = child.points();
								chstate.scaleSize = chstate.scaleSize * ys;
								for (var k = 0; k < points.length; k++) {
									points[k] = points[k] * ys;
								}
								child.points(points);
								chstate.points = points;
								//console.log(points);
								break;

							default:
								child.height(ys * child.height());
								chstate.height = child.height();
								if (hasradiustypes) {
									child.width(ys * child.width());
									chstate.width = child.width();
								}
								break;
						}

					}
					child.setAttr('state', chstate);
				}
				if (propkey == 'width' && hasradiustypes) {
					var xs = propval / obj.width();
					obj.height(xs * obj.height());
					state.height = obj.height();
				}
				if (propkey == 'height' && hasradiustypes) {
					var ys = propval / obj.height();
					obj.width(ys * obj.width());
					state.width = obj.width();
				}
				obj.setAttr(propkey, propval);
				obj.setAttr('state', state);
			}
		}
		if (state.type != 'Stage' && state.type != 'Layer' && objSelector != null) {
			objSelector.deleteOldSelector();
			objSelector.drawSelector(obj);
		}
	}
}

function updateState(obj, prop) {
	/**
	* Update the state of an object
	*/
	console.log("updateState");
	console.log(obj);
	console.log(prop);
	if (obj != null) {
		var state = obj.getAttr('state');
		for (var propkey in prop) {
			var propval = prop[propkey];
			//console.log(propkey,propval);
			if (state.type == 'Line') {
				if (propkey == 'strokeWidth') { if (propval < 2) { propval = 2; } }  //else line not visible
				if (propkey == 'lineLength') { //update second point
					var points = obj.points();
					points[2] = Math.round(propval);
					obj.points(points);
				}
			}

			if (propkey != 'type') {
				if (propkey == 'scaleSize') {
					var scaledpoints = new Array();
					for (var i = 0; i < state.points.length; i++) {
						scaledpoints.push(Math.round(state.points[i] * propval));
					}
					obj.points(scaledpoints);		//state.points unchanged

				}
				else if (propkey == 'vertices') {
					var points = state.points;
					var np = points.length / 2;
					var vn = np;
					while (vn < propval) {
						points.push(points[vn - 2] + 10 * Math.random());	//x value
						points.push(points[vn - 2] + 10 * Math.random());	// y value
						vn++;
					}
					while (vn > propval) {
						points.pop();	//x value
						points.pop();	// y value
						vn--;
					}

					state.points = points;
					var scaledpoints = new Array();
					for (var i = 0; i < state.points.length; i++) {
						scaledpoints.push(Math.round(state.points[i] * state.scaleSize));
					}
					obj.points(scaledpoints);
				}
				else if (propkey == 'width' && state.lockaspect != null) {
					if (state.lockaspect == true) {
						var whratio = state.width / state.height;
						var newheight = Math.round(propval / whratio);
						state['height'] = newheight;
						obj.height(newheight);
					}
					obj.setAttr(propkey, propval);
				}
				else if (propkey == 'height' && state.lockaspect != null) {
					if (state.lockaspect == true) {
						var whratio = state.width / state.height;
						var newwidth = Math.round(propval * whratio);
						state['width'] = newwidth;
						obj.width(newwidth);
					}
					obj.setAttr(propkey, propval);
				}
				else {
					obj.setAttr(propkey, propval);
				}
			}

			state[propkey] = propval;
			//updatePropDisp();
		}
		obj.setAttr('state', state);
		if (state.type != 'Stage' && state.type != 'Layer' && objSelector != null) {
			objSelector.deleteOldSelector();
			objSelector.drawSelector(obj);
		}
		//update object type default
		if (usedefaults == true) {
			//console.log(state.type);
			objdefaults[state.type] = JSON.stringify(obj.getAttr('state'));
		}
	}
	else {  //the designgroup for library objects

		for (var propkey in prop) {
			var propval = prop[propkey];
			console.log(propkey, propval);
			designgroup[propkey] = propval;
		}
	}
	//console.log('end objstate update');
}



function clearTempGroup() {
	/**
	* Clear all the objects in the  tempgroup
	*/
	//	if (ctrlkey == false) { //if ctrlkey released forget grouping
	if (tgroupindicator != null) {
		//release objects before destroying indicator
		tgroupindicator.destroy();
		tgroupindicator = null;
		while (tempgroup.length > 0) { //empty tempgroup
			tempgroup.pop();
		}
		layer.draw();
	}
	//	}
}


function addtoTempGroup(isdesign, obj) {
	/**
	* Add an object to the tempgroup for grouping
	*/
	if (obj.name() != 'Selector') {  //do not add the selectorobject

		if (tgroupindicator == null) {  //if the tempgroup indicator does not exist then create it
			tgroupindicator = new Konva.Rect({ name: 'groupindicator', fill: 'rgb(200,250,200)', stroke: 'rgb(0,250,250)', opacity: 0.5, strokeWidth: 4, dashEnabled: true, dash: [10, 5] });
			var gxmin = 10000; //group width and height
			var gxmax = 1;
			var gymin = 10000;
			var gymax = 1;
			layer.add(tgroupindicator);
			tgroupindicator.moveToBottom();
		}
		else {
			var gxmin = tgroupindicator.x(); //group width and height
			var gxmax = gxmin + tgroupindicator.width();
			var gymin = tgroupindicator.y();
			var gymax = gymin + tgroupindicator.height();
		}
		var objextents = getobjextents(obj);
		if (objextents.maxx > gxmax) { gxmax = objextents.maxx; } //include objects
		if (objextents.maxy > gymax) { gymax = objextents.maxy; }
		if (objextents.minx < gxmin) { gxmin = objextents.minx; }
		if (objextents.miny < gymin) { gymin = objextents.miny; }

		tempgroup.push(obj);
		//console.log(tempgroup.length);
		tgroupindicator.x(gxmin);
		tgroupindicator.y(gymin);
		tgroupindicator.width(gxmax - gxmin);  // make the indicator span all selected objects added to tempgroup
		tgroupindicator.height(gymax - gymin);
		layer.draw();
	}
}

function groupobjects() {
	/**
	* Group all the objects added to the tempgroup into a group objects
	*/
	var gxmin = 100000; //group width and height
	var gxmax = 1;
	var gymin = 100000;
	var gymax = 1;
	var numobj = tempgroup.length;
	clearActiveObject();
	if (numobj > 1) {
		var childstatearr = new Array();
		for (var i = 0; i < numobj; i++) {
			var obj = tempgroup[i];
			var objextents = getobjextents(obj);
			//console.log(objextents);
			if (objextents.maxx > gxmax) { gxmax = objextents.maxx; } //include objects
			if (objextents.maxy > gymax) { gymax = objextents.maxy; }
			if (objextents.minx < gxmin) { gxmin = objextents.minx; }
			if (objextents.miny < gymin) { gymin = objextents.miny; }
		}
		var w = gxmax - gxmin;
		var h = gymax - gymin;
		var groupstate = { name: 'none', type: 'Group', id: 'none', x: gxmin, y: gymin, width: w, height: h, visible: true, opacity: 1.0, children: [] };
		var gobj = newgroupobj(true, false, groupstate);
		while (tempgroup.length > 0) { //empty tempgroup
			var obj = tempgroup.pop();
			obj.draggable(false);  //make child not draggable
			// remove group xy offset from objects
			obj.x(obj.x() - gxmin);
			obj.y(obj.y() - gymin);

			var objstate = obj.getAttr('state');
			objstate.x = objstate.x - gxmin;
			objstate.y = objstate.y - gymin;
			obj.setAttr('state', objstate); //update state
			childstatearr.push(objstate);
			//switch off events for child so that only group is selected
			obj.off('mousedown');
			obj.off('dragmove');
			obj.off('dragend');
			obj.off('mouseover');
			obj.off('mouseout');
			gobj.add(obj);
		}
		groupstate.children = childstatearr;
		gobj.setAttr('state', groupstate);
		layer.add(gobj);

		clearTempGroup();

		return gobj;
	}
	else {
		return null;
	}
}

function ungroupobjects() {
	/**
	* Ungroup the objects in the selected group type object
	*/
	var children = new Array();
	if (activeobject != null) {
		layer = activeobject.getLayer();
		var state = activeobject.getAttr('state');

		if (state.type == 'Group') {  //check that it is a group object
			var oldchildren = (activeobject.getChildren()).toArray();
			var x0 = activeobject.x();
			var y0 = activeobject.y();
			var rot = activeobject.rotation();
			for (var i = 0; i < oldchildren.length; i++) {
				//clone works incorrectly for ring object if it has width and height defined so rather do it manually
				var child = oldchildren[i];
				//console.log(child.getAttrs());
				var objstate = child.getAttr('state');
				//console.log(objstate);
				var posang = Math.atan2(objstate.y, objstate.x);
				var posvec = Math.sqrt(objstate.x * objstate.x + objstate.y * objstate.y);
				objstate.x = x0 + Math.round(posvec * Math.cos(posang + Math.PI * rot / 180.0));  //restore offset according to group position and rotation
				objstate.y = y0 + Math.round(posvec * Math.sin(posang + Math.PI * rot / 180.0));
				if (objstate.rotation != null) {
					objstate.rotation = objstate.rotation + rot;
					//console.log(objstate.rotation);
				}
				else {
					objstate.rotation = rot;
				}
				//console.log(objstate);

				/*			if (objstate.type == 'Group') {
								var obj = newgroupobj(true,false,objstate);
							}
							else {
								var obj = newobj(true,objstate);
							}
							layer.add(obj);

							children.push(obj);  */
				child.draggable(true);
				objEvents(child);
				child.moveTo(layer);
				child.x(objstate.x);
				child.y(objstate.y);
				child.rotation(objstate.rotation);
				children.push(child);
			}
			//destroy groupobject
			if (objSelector != null) { objSelector.deleteOldSelector(); }
			activeobject.destroy();
			layer.draw();
			$("#proptable").empty();
		}
	}
	return children;
}

function objEvents(obj) {

	/**
	* Define the object events for a new object
	*/
	obj.on('mouseover', function () {
		document.body.style.cursor = 'pointer';
		cursorstate = 'onobj';
	});

	obj.on('mouseout', function () {
		document.body.style.cursor = 'default';
		cursorstate = 'free';
	});

	obj.on('mousedown', function () {

		clearActiveObject();

		if (ctrlkey == true) {  //selected for grouping
			//console.log(tempgroup.indexOf(this));
			if (tempgroup.indexOf(this) == -1) {
				$("#proptable").empty();
				addtoTempGroup(true, this);
				selectObject('grouping');
				//console.log('grouping');
			}
		}
		else {  //selected normally

			if (tgroupindicator != null) {
				clearTempGroup();
			}
			activeobject = obj;
			//console.log(activeobject.getZIndex());
			updatePropDisp();
			//add the object selector
			if (objSelector == null) {
				objSelector = new objectSelector();
			}
			//layer.add(objSelector.objSelGroup);
			objSelector.drawSelector(this);
			selectObject('canvas');
			//console.log('kineticjs');

		}

	});

	obj.on('dragmove', function () {
		objSelector.drawSelector(this);

	});

	obj.on('dragend', function () {
		activeobject = obj;
		updateState(activeobject, { x: this.x(), y: this.y() });
		updatePropDisp();

	});




}

function cleardesign() {
	/**
	* Clear all objects on the active layer
	*/
	var numobj = checknumObjects();
	if (numobj > 0) {
		var ans = confirm('Are you sure you want to delete the design?');
		if (ans == true) {
			layer.destroyChildren();
			objSelector = new objectSelector();
			layer.add(objSelector.objSelGroup);
			layer.draw();
			activeobject = null;
			$("#proptable").empty();

		}
	}
}

function delobj() {
	/**
	* Delete the selected object
	*/

	objSelector.deleteOldSelector();
	activeobject.destroy();
	layer.draw();
	$("#proptable").empty();

}

function copyobj() {
	/**
	* Copy the selected object, apply object selector to it and show its properties
	*/
	if (activeobject != null) {
		var statestr = JSON.stringify(activeobject.getAttr('state'));
		var state = JSON.parse(statestr);

		state.name = 'none';
		state.id = 'none';
		state.x = state.x + 10;
		state.y = state.y + 10;
		//console.log(state);
		var obj = newobj(true, state);
		layer.add(obj);
		objSelector.deleteOldSelector();
		activeobject = obj;
		updatePropDisp();
		objSelector.drawSelector(obj);
		return obj;
	}
}

function moveup() {
	/**
	* Move the object up in the layer z-index
	*/
	if (activeobject != null) {
		activeobject.moveUp();
		layer.draw();
	}
}

function movedown() {
	/**
	* Move the object down in the layer z-index
	*/
	if (activeobject != null) {
		activeobject.moveDown();
		layer.draw();
	}
}

function newgroupobj(isdesign, editable, state) {
	/**
	* Create a new group object from the state containing objects in the state.children array
	* If the children array contains a group object then recursively call this function
	* isdesign and editable are boolean values which determine whether the object added is draggable
	*/
	if (state.id == 'none') { state.id = UniqueId(); }

	var theGroup = new Konva.Group({
		name: state.name,
		id: state.id,
		x: state.x,
		y: state.y,
		width: state.width,
		height: state.height,
		draggable: isdesign
	});

	var gchildren = state.children;
	//console.log(gchildren);
	for (var i = 0; i < gchildren.length; i++) {
		childstate = gchildren[i];
		childstate.id = "none";
		//console.log(childstate);
		if (childstate.type == 'Group') {
			var obj = newgroupobj(editable, editable, childstate);
		}
		else {
			var obj = newobj(editable, childstate);
		}
		//console.log(obj);
		theGroup.add(obj);
	}

	for (var propkey in state) {
		var propval = state[propkey];
		theGroup.setAttr(propkey, propval);
	}

	if (isdesign) {
		objEvents(theGroup);
	}

	theGroup.setAttr('state', state);
	return theGroup;
}


function newobj(isdesign, state) {
	/**
	* Create a new single object according to its state
	* isdesign is a boolean determining whether the object is draggable
	*/
	var objtype = state.type;
	if (state.id == 'none') { state.id = UniqueId(); }


	switch (objtype) {

		case 'Image':
			var imageObj = new Image();
			var obj = new Konva.Image({
				id: state.id,
				image: imageObj,
				draggable: isdesign
			});
			imageObj.onload = function () {
				var objlayer = obj.getLayer();
				if (objlayer != null) {
					objlayer.draw();
				}
			}
			imageObj.src = state.path;

			break;
		case 'Rect':
			var obj = new Konva.Rect({
				id: state.id,
				draggable: isdesign
			});

			break;
		case 'Ellipse':
			var obj = new Konva.Ellipse({
				id: state.id,
				draggable: isdesign
			});

			break;
		case 'RegularPolygon':
			var obj = new Konva.RegularPolygon({
				id: state.id,
				draggable: isdesign
			});

			break;

		case 'Star':
			var obj = new Konva.Star({
				id: state.id,
				draggable: isdesign
			});

			break;

		case 'Ring':
			var obj = new Konva.Ring({
				id: state.id,
				draggable: isdesign
			});

			break;

		case 'Text':
			var obj = new Konva.Text({
				id: state.id,
				draggable: isdesign
			});

			break;

		case 'Line':
			var obj = new Konva.Line({
				id: state.id,
				points: [0, 0, state.lineLength, 0],
				draggable: isdesign
			});
			break;

		case 'PolyLine':
			var obj = new Konva.Line({
				id: state.id,
				draggable: isdesign
			});
			break;

		case 'CurvedArrow':
			var obj = CurvedArrow(isdesign, state);
			break;

		case 'Figure':
			var obj = new Konva.Line({
				id: state.id,
				closed: true,
				draggable: isdesign
			});
			break;

		case 'Path':
			var obj = new Konva.Path({
				id: state.id,
				draggable: isdesign
			});
			break;

	}

	//add stroke dash property
	if (state.dashEnabled == null) { state.dashEnabled = false; }
	obj.dash(dashdef);


	for (var propkey in state) {
		var propval = state[propkey];
		obj.setAttr(propkey, propval);
	}

	// Ensure correct scaling is applied for Figures when creating them, if present
	if (objtype == "Figure" && state.scaleSize) {
		var scaleValue = state.scaleSize;
		var scaledpoints = new Array();
		for (var i = 0; i < state.points.length; i++) {
			scaledpoints.push(Math.round(state.points[i] * scaleValue));
		}
		obj.points(scaledpoints);
	}

	if (isdesign) {
		objEvents(obj);
	}

	obj.setAttr('state', state);
	obj.perfectDrawEnabled(false);
	// obj.strokeHitEnabled(false);
	obj.shadowForStrokeEnabled(false);
	return obj;
}


function addobj(objtype) {
	/**
	* Add a new standard object according to a type string
	*/
	var xpos = Math.round(100 * Math.random());  // position it in a random region so that two new objects don't overlap and hide each other
	var ypos = Math.round(100 * Math.random());
	var obj = null;

	switch (objtype) {

		case 'Image':
			activebutton = 'image';
			obj = newobj(true, { name: 'none', id: 'none', type: 'Image', path: '/images/image.png', x: xpos, y: ypos, width: 100, height: 100, lockaspect: false, rotation: 0, visible: true, opacity: 1.0 });
			break;

		case 'Rect':
			activebutton = 'rect';
			obj = newobj(true, { name: 'none', id: 'none', type: 'Rect', x: xpos, y: ypos, width: 50, height: 100, lockaspect: false, rotation: 0, fill: defcolour, stroke: defstroke, strokeWidth: defstrokewidth, dashEnabled: false, cornerRadius: 0, visible: true, opacity: 1.0 });

			break;

		case 'Ellipse':
			activebutton = 'ellipse';
			obj = newobj(true, { name: 'none', id: 'none', type: 'Ellipse', x: xpos + 30, y: ypos + 30, width: 50, height: 80, lockaspect: false, rotation: 0, fill: defcolour, stroke: defstroke, strokeWidth: defstrokewidth, dashEnabled: false, visible: true, opacity: 1.0 });
			break;

		case 'RegularPolygon':
			activebutton = 'polygon';
			obj = newobj(true, { name: 'none', id: 'none', type: 'RegularPolygon', x: xpos + 30, y: ypos + 30, rotation: 0, sides: 5, radius: 30, fill: defcolour, stroke: defstroke, strokeWidth: defstrokewidth, dashEnabled: false, visible: true, opacity: 1.0 });
			break;

		case 'Star':
			activebutton = 'star';
			obj = newobj(true, { name: 'none', id: 'none', type: 'Star', x: xpos + 30, y: ypos + 30, rotation: 0, numPoints: 5, innerRadius: 15, outerRadius: 30, fill: defcolour, stroke: defstroke, strokeWidth: defstrokewidth, dashEnabled: false, visible: true, opacity: 1.0 });
			break;

		case 'Ring':
			activebutton = 'ring';
			obj = newobj(true, { name: 'none', id: 'none', type: 'Ring', x: xpos + 30, y: ypos + 30, innerRadius: 15, outerRadius: 30, fill: defcolour, stroke: defstroke, strokeWidth: defstrokewidth, dashEnabled: false, visible: true, opacity: 1.0 });
			break;

		case 'Text':
			activebutton = 'text';
			obj = newobj(true, { name: 'none', id: 'none', type: 'Text', x: xpos + 30, y: ypos + 30, rotation: 0, text: 'text', fontSize: 24, fontFamily: 'Arial', fill: defcolour, stroke: defstroke, strokeWidth: 1, dashEnabled: false, visible: true, opacity: 1.0 });
			break;

		case 'Line':
			activebutton = 'line';
			obj = newobj(true, { name: 'none', id: 'none', type: 'Line', x: xpos + 30, y: ypos + 30, lineLength: 100, rotation: 0, stroke: defstroke, strokeWidth: defstrokewidth, dashEnabled: false, visible: true, opacity: 1.0 });
			break;

		case 'PolyLine':
			activebutton = 'polyline';
			obj = newobj(true, { name: 'none', id: 'none', type: 'PolyLine', x: xpos + 30, y: ypos + 30, fill: defcolour, rotation: 0, stroke: defstroke, strokeWidth: defstrokewidth, dashEnabled: false, vertices: 3, tension: 0, points: [0, 0, -30, 100, 100, 100], closed: true, scaleSize: 1.0, visible: true, opacity: 1.0 });
			break;

		case 'CurvedArrow':
			activebutton = 'curvedarrow';
			obj = newobj(true, { name: 'none', id: 'none', type: 'CurvedArrow', x: xpos + 30, y: ypos + 30, rotation: 0, fill: defcolour, stroke: defstroke, strokeWidth: defstrokewidth, dashEnabled: false, visible: true, opacity: 1.0, portion: 1.0, midX: 100, midY: 50, endX: 100, endY: 100, arrowWidth: ar_width, arrowheadLength: ar_headlength, arrowheadWidth: ar_headwidth });
			break;

		case 'Mfigure':
			activebutton = 'mfig';
			obj = newobj(true, { name: 'none', id: 'none', type: 'Figure', x: xpos + 30, y: ypos + 30, fill: defcolour, rotation: 0, stroke: defstroke, strokeWidth: defstrokewidth, dashEnabled: false, tension: 0, points: [0, 0, -3.5, 1, -7, 5, -9, 10, -7, 16, -2, 19, -3, 22, -9, 22, -22, 54, -21, 55, -20, 57, -16, 57, -10, 40, -10, 90, -8, 92, -5, 93, -3, 90, -2, 60, 2, 60, 3, 90, 5, 93, 8, 92, 10, 90, 10, 40, 16, 57, 20, 57, 21, 55, 22, 54, 9, 22, 3, 22, 2, 19, 7, 16, 9, 10, 7, 5, 3.5, 1], scaleSize: 1.0, visible: true, opacity: 1.0 });

			break;

		case 'Ffigure':
			activebutton = 'ffig';
			obj = newobj(true, { name: 'none', id: 'none', type: 'Figure', x: xpos + 30, y: ypos + 30, fill: defcolour, rotation: 0, stroke: defstroke, strokeWidth: defstrokewidth, dashEnabled: false, tension: 0, points: [0, 0, -3.5, 1, -7.5, 5, -9, 10, -6.7, 16, -2, 19, -3, 22, -9, 22, -23, 54, -21, 55, -19, 57, -16, 56, -10, 40, -15, 70, -10, 70, -10, 90, -8, 93, -4.5, 93, -3, 90, -3, 70, 3, 70, 3, 90, 4.5, 93, 8, 93, 10, 90, 10, 70, 15, 70, 10, 40, 16, 56, 19, 57, 21, 55, 23, 54, 9, 22, 3, 22, 2, 19, 6.7, 16, 9, 10, 7.5, 5, 3.5, 1, 0, 0], scaleSize: 1.0, visible: true, opacity: 1.0 });
			break;
	}

	layer.add(obj);
	if (objSelector != null) {
		objSelector.deleteOldSelector();
		objSelector.drawSelector(obj);
	}
	activeobject = obj;
	updatePropDisp();
	return obj;
}

function coreSetup() {
	/**
	* Set up events and the library object selector object
	*/

	$(document).keydown(function (event) {
		var keycode = (event.keyCode ? event.keyCode : event.which);
		//if (keycode == 17) { ctrlkey = true;}
	});
	$(document).keyup(function (event) {
		var keycode = (event.keyCode ? event.keyCode : event.which);
		//if (keycode == 17) { ctrlkey = false;}
	});

	libselector = new Konva.Rect({ name: 'libselector', visible: false, width: objwh, height: objwh, fill: '#ccccee', stroke: '#ccccee', strokeWidth: 1 });

}
