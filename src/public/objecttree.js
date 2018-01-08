
var treecontainer = null;
var selectednode = null;
var selbotnodes = new Array();

function makeTree(projobj)
{
/**
* Creates a tree and implements various events (needs jstree )
*/
	treecontainer.jstree('destroy');
	treecontainer
	.on('select_node.jstree', function (e, data) {
		selectednode = data.node;
		selbotnodes = treecontainer.jstree(true).get_bottom_selected();
		if (selbotnodes.length>0) {
			var allselnodes = treecontainer.jstree(true).get_selected();
			//console.log(selbotnodes);
			// deselect any top nodes that may be selected
			for (var n=0;n<allselnodes.length;n++) {
				var anode = allselnodes[n];
				if (selbotnodes.indexOf(anode) == -1)
				{
					treecontainer.jstree(true).deselect_node(anode);			
				}
			}
		}
		selectObject('jstree');
			
	})
	.on('deselect_node.jstree', function (e, data) {
		selbotnodes = treecontainer.jstree(true).get_bottom_selected();
		if (selbotnodes.length>0) {
			var allselnodes = treecontainer.jstree(true).get_selected();
			//console.log(selbotnodes);
			// deselect any top nodes that may be selected
			for (var n=0;n<allselnodes.length;n++) {
				var anode = allselnodes[n];
				if (selbotnodes.indexOf(anode) == -1)
				{
					treecontainer.jstree(true).deselect_node(anode);			
				}
			}
		}
		selectObject('jstree');		
	})	
	.on('create_node.jstree', function (e, data) {
			//console.log(data);
		if (openedproject) {
			var nodeinfo = fetchnextProjectNode();
			//console.log(nodeinfo);
			if (nodeinfo != null) {
				addTreeNode(nodeinfo.parentid,nodeinfo.nodeid,nodeinfo.nodestate);
			}
			else {
				treecontainer.jstree(true).open_node('#'+project.id);
			}
		}
		else {
			var nparent = data.parent;
			//console.log(data);
			treecontainer.jstree(true).deselect_all(true);
			treecontainer.jstree(true).select_node(data.node);
			if (treecontainer.jstree(true).is_open(nparent) == false) {
				treecontainer.jstree(true).open_node(nparent);
			}
		}

	})
	.on('ready.jstree', function () {
		treecontainer.jstree(true).select_node('#'+project.id);
		if (openedproject) {
			var nodeinfo = fetchnextProjectNode();
			//console.log(nodeinfo);
			if (nodeinfo != null) {
				addTreeNode(nodeinfo.parentid,nodeinfo.nodeid,nodeinfo.nodestate);
			}
		}
	})
	.on('move_node.jstree', function (e,data) {
		//console.log(data.node,data.parent,data.position,data.old_position,data.old_parent);
		moveNode(data.node,data.parent,data.old_parent,data.position,data.old_position);
		treecontainer.jstree(true).deselect_all(true);
		treecontainer.jstree(true).select_node(data.node);
	})
	.jstree({ 'core' : {
    'data' : [
       { "id" : projobj.id, "parent" : "#", "type" : projobj.type, "text" : projobj.name }
    ],
    'themes' : {
      "variant" : "small"
    },    
    'check_callback': function(operation, node, node_parent, node_position) {
    	//console.log(operation, node, node_parent, node_position);
    	//var parenttype;
    	return true;
    },
    'multiple' : true
	},

  "types" : {
    "#" : {
      "max_children" : 1, 
      "max_depth" : 10, 
      "valid_children" : ["Project"]
    },
    "Project" : {
      "icon" : "images/proj.png",
      "valid_children" : ["Layer"]
    },
    "default" : {
      "valid_children" : ["default"]
    },
    "Layer" : {
      "icon" : "images/layer.png",
      "valid_children" : ["Group","Rect","Ellipse","Figure","Ring","Text","Star","RegularPolygon","Image","Line","PolyLine","CurvedArrow"]
    },
    "Group" : {
      "icon" : "images/group.png",
      "valid_children" : []
    },
    "Star" : {
      "icon" : "images/star.png",
      "valid_children" : []
    },
    "Rect" : {
      "icon" : "images/rect.png",
      "valid_children" : []
    },
    "Ellipse" : {
      "icon" : "images/circ.png",
      "valid_children" : []
    },
    "Ring" : {
      "icon" : "images/ring.png",
      "valid_children" : []
    },
    "RegularPolygon" : {
      "icon" : "images/poly.png",
      "valid_children" : []
    },
    "Image" : {
      "icon" : "images/image.png",
      "valid_children" : []
    },
    "Figure" : {
      "icon" : "images/figure.png",
      "valid_children" : []
    },
   "Text" : {
      "icon" : "images/text.png",
      "valid_children" : []
    },    
    "Line" : {
      "icon" : "images/line.png",
      "valid_children" : []
    },
    "PolyLine" : {
      "icon" : "images/polyline.png",
      "valid_children" : []
    },
    "CurvedArrow" : {
      "icon" : "images/arrow.png",
      "valid_children" : []
    }
  },
  "dnd" : {
      "is_draggable" : function (nodes) {
			var approval = false;
			var nodetype = nodes[0].type;
      	switch(nodetype) {
      		case 'Stage':
      			approval = false;
      		break;
      		default:
     				approval = true;
      		break;
      		
      	}
      	return approval;
      }
      
  },
  "plugins" : ["types","dnd"]	
	
	});	  	

}

function addTreeNode(parentid,objid,objstate)
{
/**
* Adds a tree node with state information
*/	
	var ref = treecontainer.jstree(true);
	sel = ref.create_node(parentid,{ "id" : objid, "parent" : parentid, "text" : objstate.name, "type":objstate.type,"li_attr" : {"data-obj":objstate} });
	//console.log(parentid,objid,objstate,sel,ref);
}