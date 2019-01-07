/**
 * Living Lab Project functions
 *
 */

var os = require("os"),
	fs = require("fs"),
	path = require("path"),
	nunjucks = require("nunjucks"),
	_ = require('lodash/core'),
	database = require("./database"),
	helpers = require("./helpers");


function load(projectId, cb) {

	var db = database.getDb();

	var sql = "SELECT id,name,createdate,lastdate,creator,json FROM Projects WHERE id = ?";

	db.get(sql, [projectId], function(err, row) {
		var proj = {};
		if ( ! err) {
			proj = row;
			proj.json = JSON.parse(row.json);
		}
		cb(err, proj);
	});

}


/**
 * Create an entry in the Players table for a given project
 *
 */
function createPlayerEntry(project, cb) {

	var db = database.getDb();

	// Check for existing row
	var sql = "SELECT name FROM Players WHERE project_id = $id";
	var params = { $id: project.id };

	// Slugify project name for Players entry
	var name = helpers.slugify(project.name);

	db.each(sql, params, function (error, row) {
		// console.log(row.name);
	}, function(err, rows) {

		if (rows > 0) {

			sql = "UPDATE Players SET name = $name WHERE project_id = $id";

			params = {
				$name: name,
				$projectId: project.id
			};

			db.run(sql, params, function(error) {
				cb(error, { "project_id": project.id, "name": name });
			});

		} else {

			sql = "INSERT INTO Players (project_id, name) VALUES ($projectId, $name)";

			params = {
				$name: name,
				$projectId: project.id
			};

			db.run(sql, params, function(error) {
				cb(error, { "project_id": project.id, "name": name });
			});
		}

	});
}


/**
 * Load a project by the player name
 *
 */
function loadByName(name, cb) {

	var db = database.getDb();

	// Get entry from Players
	var sql = "SELECT project_id FROM Players WHERE name = $id";

	db.get(sql, [name], function(err, row) {
		if ( ! err && row) {
			load(row.project_id, cb);
		} else {
			cb(err, null);
		}
	});

}


/**
* Finds all image objects on a layer
*
*/
function findLayerImages(objstates) {

	var imgobjs = [],
		obj = null;

	for (var chi = 0; chi < objstates.length; chi++) {
		obj = objstates[chi];
		if (obj.type == 'Group') {
			findLayerImages(obj.children);
		} else {
			if (obj.type == 'Image') {
				imgobjs.push(obj);
			}
		}
	}

	return imgobjs;
}


function findIndexByKey(params) {
	var found = false,
		i = 0,
		index = -1;

	if (params.list == undefined) {
		return index;
	}

	while (found == false && i < params.list.length) {
		if (params.value == params.list[i][params.key]) {
			found = true;
			index = i;
		}
		i = i + 1;
	}
	return index;
}


/**
 * Given a layer ID, return the index of its location in the array layerstates
 *
 */
function findByKey(params) {

	var found = false,
		i = 0,
		index = -1;

	while (found == false && i < params.list.length) {
		if (params.value == params.list[i][params.key]) {
			return params.list[i];
		}
		i = i + 1;
	}
	return null;
}


function findActionById(actionId, layer) {

	var action = null;

	_.forEach(layer.eventlists, function(lay) {

		_.forEach(lay.actions, function(act) {
			if (act.id == actionId) {
				action = act;
				return false;
			}
		});

		if (action !== null) {
			return false;
		}

	});

	return action;
}


/**
 * Do the same process as `compileViews` from the Design Screen.
 *
 */
function toPlayer(project) {

	// console.log("toPlayer");

	var actiontypes = {
		'appear': 'visible',
		'disappear': 'visible',
		'fadein': 'opacity',
		'fadeout': 'opacity',
		'move': 'position',
		'arrowflow': 'portion'
	};  //type:property

	var out = {
		"errors": [],
		"data": {}
	}

	var data = project.json;

	var pelayerobjstates = [];  // snapshot state of objects and actions on each layer on start of each presentevent
	var playimages = [];

	var layers = data.layers;
	var layerstates = [];

	for (var li = 0; li < layers.length; li++) {

		var stlayer = layers[li];
		var layerstate = stlayer.startstate;

		if ( ! layerstate || layerstate == null) {
			out.errors.push("Layer startstates are not defined.");
			return out;
		}

		var layerobjs = JSON.parse(layerstate);

		//if the objects are image objects we need to package the image resources as well and change the image paths
		var playimgs = findLayerImages(layerobjs);
		for (var imn = 0; imn < playimgs.length; imn++) {
			var imgobj = playimgs[imn];
			playimages.push(imgobj.path);
		}

		//objstates are object states and layeractions are action definitions/states for each action applied on that presentevent
		layerstates.push({
			layerid: stlayer.id,
			objstates: layerobjs,
			layeractions: []
		});

	}

	pelayerobjstates.push(layerstates);
	// console.log("pelayerobjstates");
	// console.log(pelayerobjstates);

	var eventliststates = data.presentevents;

	var layerstates,
		pevstate,
		peviews;

	// snapshots for each presentevent following first one
	for (var pevindex = 0; pevindex < eventliststates.length; pevindex++) {

		if (pevindex < eventliststates.length - 1) {
			if (pelayerobjstates[pevindex] !== undefined) {
				var origlayerobjstate = JSON.stringify(pelayerobjstates[pevindex]);
				//clone layerstates from previous one
				var newlayerobjstate = JSON.parse(origlayerobjstate);
			}
		}

		layerstates = [];
		pevstate = eventliststates[pevindex];
		peviews = pevstate.peviews;

		var peview,
			scrname,
			layerid,
			sendlayer = null,
			layerexists = false;

		//get actions for the event
		for (var pei = 0; pei < pevstate.peviews.length; pei++) {

			peview = peviews[pei];

			scrname = peview.viewstate.name;
			layerid = peview.layerid;
			sendlayer = findByKey({ "key": "id", "value": layerid, "list": layers });

			if (sendlayer) {
				layerexists = true;
			}

			if (layerid != 'none' && layerexists) {

				// console.log("Layer " + layerid + " exists.");

				var pevactions = peview.actions;
				// console.log("pevactions");
				// console.log(pevactions);
				actionstatearr = [];
				for (var ai = 0; ai < pevactions.length; ai++) {
					var actid = pevactions[ai].id;
					var actstate  = findActionById(actid, sendlayer);
					if (actstate) {
						actionstatearr.push(actstate);
					}
				}

				// console.log("actionstatearr");
				// console.log(actionstatearr);

				// var layerind = findPELayer(layerid, pelayerobjstates[pevindex]);
				var layerind = findIndexByKey({ key: "layerid", value: layerid, list: pelayerobjstates[pevindex] });
				pelayerobjstates[pevindex][layerind].layeractions = actionstatearr;

				if (pevindex < eventliststates.length - 1) {

					//now apply actions to applicable objects in layer to get new layerstate snapshot
					if (newlayerobjstate[layerind] !== undefined) {

						var newlayerobjs = newlayerobjstate[layerind].objstates;
						for (var lai = 0; lai < actionstatearr.length; lai++) {
							var astate = actionstatearr[lai];
							var objind = findIndexByKey({ key: "id", value: astate.parentobjectid, list: newlayerobjs });
							if (objind != -1) {
								var objstate = newlayerobjs[objind];
								var prop = actiontypes[astate.actiontype];
								if (prop == 'position') {
									objstate.x = astate.endstate.x;
									objstate.y = astate.endstate.y;
								} else {
									objstate[prop] = astate.endstate;
								}
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

	var compiledViews = {
		screenwidth: data.screenwidth,
		screenheight: data.screenheight,
		txscale: 1.0,
		layersnapshots: pelayerobjstates,
		pestates: eventliststates,
		playimages: playimages
	};

	out.data = compiledViews;

	return out;
}


module.exports = {
	"load": load,
	"loadByName": loadByName,
	"createPlayerEntry": createPlayerEntry,
	"toPlayer": toPlayer,
};