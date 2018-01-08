var objSelector = null;
var cursorstate = 'free';
var scsz = 1.0; //length from origin to centroid of figure calculated from state attribute points not line object

function getCentroid(points) {
/**
*centroid of a closed non-selfoverlapping polygon where x0=xn and y0=yn. Points is array of [x0,y0,x1,y1..x(n-1),y(n-1)]
*/
	var N=(points.length/2);
	var xp = new Array();
	var yp = new Array();
	for (var i=0;i<N;i++) {
		xp.push(points[2*i]);
		yp.push(points[2*i+1]);	
	}
	xp.push(points[0]);
	yp.push(points[1]);
	
	//Area
	var A = 0.0;
	for (var n=0;n<N;n++) {
		A = A + (xp[n]*yp[n+1] - xp[n+1]*yp[n]);		
	}
	A = 0.5*A;

	var Cx = 0.0;
	var Cy = 0.0;
	for (var n=0;n<N;n++) {
		Cx = Cx + (xp[n]+xp[n+1])*(xp[n]*yp[n+1] - xp[n+1]*yp[n]);		
		Cy = Cy + (yp[n]+yp[n+1])*(xp[n]*yp[n+1] - xp[n+1]*yp[n]);		
	}
	Cx = Cx/(6*A);
	Cy = Cy/(6*A);
	
	return {Area:A,CentroidX:Cx,CentroidY:Cy};


}

function updateAnchor(activeAnchor,selobj) {
/**
* Update the object state values and property display when an anchor is moved
* The left top anchor normally changes the position and size of an object whereas the rightbottom achor
* normally rotates the object, but the actions of the anchors depend on the specific object type that it is attached to.
*/ 	
  var group = activeAnchor.getParent();
  var anchorX = activeAnchor.x();
  var anchorY = activeAnchor.y();

  var Anchors = group.getChildren().toArray();

  for (var i=0;i<Anchors.length;i++) {
  	Anchors[i].fill('#ddd');
  	Anchors[i].stroke('#666');
  }
  activeAnchor.fill('#00ff55'); 
  activeAnchor.stroke('#00ff55');

	var anchor0 = group.find('.anchor0')[0];
	var anchor1 = group.find('.anchor1')[0];
		
		  
	if (selobj != null)
	{
			var state = selobj.getAttr('state');	  	
		  	switch(state.type) {

		  		case 'Ring':
				  // update anchor positions
				  var innerradius = selobj.getAttr('innerRadius');
				  var outerradius = selobj.getAttr('outerRadius');
				  var xpos = selobj.x();
				  var ypos = selobj.y();
				  switch (activeAnchor.name()) {
				    case 'anchor0':
						var w = anchorX-xpos;
						var h = anchorY-ypos;
						innerradius = Math.round(Math.sqrt(w*w+h*h));
				      break;
		
				    case 'anchor1':
						var w = anchorX-xpos;
						var h = anchorY-ypos;
						outerradius = Math.round(Math.sqrt(w*w+h*h));
						break;
					}

			  		updateState(selobj,{innerRadius:innerradius,outerRadius:outerradius});
			  		updatePropDisp();
		  		
		  			break;
		  		
		  		case 'Star':
				  // update anchor positions
				  var innerradius = selobj.getAttr('innerRadius');
				  var outerradius = selobj.getAttr('outerRadius');
				  var xpos = selobj.x();
				  var ypos = selobj.y();
				  switch (activeAnchor.name()) {
				    case 'anchor0':
						var w = anchorX-xpos;
						var h = anchorY-ypos;
						innerradius = Math.round(Math.sqrt(w*w+h*h));
			  			updateState(selobj,{innerRadius:innerradius});
				      break;
		
				    case 'anchor1':
						var w = anchorX-xpos;
						var h = anchorY-ypos;
						outerradius = Math.round(Math.sqrt(w*w+h*h));
						var lineang = (180/Math.PI)*Math.atan2(w,-h);  					
			  			updateState(selobj,{rotation:lineang,outerRadius:outerradius});
						break;
					}

			  		updatePropDisp();
		  		
		  			break;

		  		case 'RegularPolygon':
				  // update anchor positions
				  var radius = selobj.getAttr('radius');
				  switch (activeAnchor.name()) {
				    case 'anchor0':
						selobj.x(anchorX);
						selobj.y(anchorY);
						var xpos = selobj.x();
						var ypos = selobj.y();
				  		updateState(selobj,{x:xpos,y:ypos});
				      break;
		
				    case 'anchor1':
						var w = anchorX-anchor0.x();
						var h = anchorY-anchor0.y();
						radius = Math.round(Math.sqrt(w*w+h*h));
						var lineang = (180/Math.PI)*Math.atan2(w,-h);  					
				  		updateState(selobj,{radius:radius, rotation: lineang});
						break;
					}

			  		updatePropDisp();
		  		
		  			break;

		  		case 'Text':
				  switch (activeAnchor.name()) {
				    case 'anchor0':
					  	selobj.setPosition(anchor0.getPosition());
						var xpos = selobj.x();
						var ypos = selobj.y();
			  			updateState(selobj,{x:xpos,y:ypos});
				      break;
		
				    case 'anchor1':
						var w = anchorX-anchor0.x();
						var h = anchorY-anchor0.y();
						var diagang = Math.atan2(selobj.height(),selobj.width());
						var rotang = (180/Math.PI)*(Math.atan2(h,w)-diagang);  					
				  		updateState(selobj,{rotation: rotang});
						break;
					}
				 	
			  		updatePropDisp();
		  			break;

		  		case 'Line':
				  switch (activeAnchor.name()) {
				    case 'anchor0':
						var w = anchor1.x()-anchorX;
						var h = anchor1.y()-anchorY;
				      break;
		
				    case 'anchor1':
						var w = anchorX-anchor0.x();
						var h = anchorY-anchor0.y();
						break;
					}

 					selobj.setPosition(anchor0.getPosition());
					var xpos = selobj.x();
					var ypos = selobj.y();
					var ll = Math.round(Math.sqrt(w*w+h*h));
					var lineang = (180/Math.PI)*Math.atan2(h,w);  					
			  		updateState(selobj,{x:xpos,y:ypos,lineLength:ll, rotation: lineang});
			  		updatePropDisp();
		  			break;		  					  		

		  		case 'PolyLine':
					if (activeAnchor != anchor0) {
						var w = anchorX-anchor0.x();
						var h = anchorY-anchor0.y();
						var ll = (Math.round(Math.sqrt(w*w+h*h)))/state.scaleSize;
						var ang = (Math.PI/180)*selobj.rotation();
						var Eang = Math.atan2(h,w);  
						var ppoints = state.points;
						ppoints[activeAnchor.id()*2] = ll*Math.cos(Eang-ang);				
						ppoints[activeAnchor.id()*2+1] = ll*Math.sin(Eang-ang);	
						selobj.points(ppoints);	
				  		updateState(selobj,{points:ppoints,scaleSize:state.scaleSize});//also scaleSize to rescale points()
				  		updatePropDisp();
			  		}
			  		else {
	 					selobj.setPosition(activeAnchor.getPosition());
						var xpos = selobj.x();
						var ypos = selobj.y();
						updateState(selobj,{x:xpos,y:ypos});	
						updatePropDisp();		  			
			  		}
		  			break;		  					  		

		  		case 'Figure':
				  switch (activeAnchor.name()) {
				    case 'anchor0':
						//var w = anchor1.x()-anchorX;
						//var h = anchor1.y()-anchorY;
	 					selobj.setPosition(anchor0.getPosition());
						var xpos = selobj.x();
						var ypos = selobj.y();
				  		updateState(selobj,{x:xpos,y:ypos});
				      break;
		
				    case 'anchor1':
						var w = anchorX-anchor0.x();
						var h = anchorY-anchor0.y();
						var ll = Math.round(Math.sqrt(w*w+h*h));
						var lineang = (180/Math.PI)*Math.atan2(-w,h); 
						var scaling = ll/scsz;					
				  		updateState(selobj,{scaleSize:scaling, rotation: lineang});
						break;
					}
			  		updatePropDisp();
		  			break;
		  					  					  		
		  		case 'CurvedArrow':
					var xpos = selobj.x();
					var ypos = selobj.y();	
					var ang = (selobj.getAttr('rotation'))*Math.PI/180.0;			  
					switch (activeAnchor.name()) {
				    case 'anchor0':
	  					var llmid = Math.sqrt((anchorX-xpos)*(anchorX-xpos)+(anchorY-ypos)*(anchorY-ypos));
	  					var Mang = Math.atan2((anchorY-ypos),(anchorX-xpos));
	  					var midx = llmid*Math.cos(Mang-ang);
	  					var midy = llmid*Math.sin(Mang-ang);
				  		updateState(selobj,{midX:midx,midY:midy});
				  		updatePropDisp();
				      break;
		
				    case 'anchor1':
	  					var llend = Math.sqrt((anchorX-xpos)*(anchorX-xpos)+(anchorY-ypos)*(anchorY-ypos));
		  				var Eang = Math.atan2((anchorY-ypos),(anchorX-xpos));
	  					var endx = llend*Math.cos(Eang-ang);
	  					var endy = llend*Math.sin(Eang-ang);
				  		updateState(selobj,{endX:endx,endY:endy});
				  		updatePropDisp();
						break;
					}

		  			break;		  					  		

		  		case 'Group':
				  switch (activeAnchor.name()) {
				    case 'anchor0':
						var w = anchorX-anchor1.x();
						var h = anchorY-anchor1.y();
						selobj.setPosition(anchor0.getPosition());
						
						var anchorang = Math.atan2(h,w);
						var ang = (selobj.getAttr('rotation'))*Math.PI/180.0;
						var ws = Math.abs(Math.round(Math.sqrt(w*w+h*h)*Math.cos(anchorang-ang)));
						var hs = Math.abs(Math.round(Math.sqrt(w*w+h*h)*Math.sin(anchorang-ang)));
			
						var xpos = selobj.x();
						var ypos = selobj.y();
						//var xs = ws/selobj.width();
						//var ys = hs/selobj.height();
				  		//updateState(selobj,{x:xpos,y:ypos,scaleX:xs, scaleY: ys});
				  		updateGroupState(selobj,{x:xpos,y:ypos,width:ws, height: hs});
				      break;
		
				    case 'anchor1':
						var w = anchorX-anchor0.x();
						var h = anchorY-anchor0.y();
						var diagang = Math.atan2(selobj.height(),selobj.width());
						var rotang = (180/Math.PI)*(Math.atan2(h,w)-diagang);  					
				  		updateState(selobj,{rotation: rotang});
						break;
					}
				 	
			  		updatePropDisp();
		  		
					break;
					
		  		default:
					
				  // update anchor positions
				  switch (activeAnchor.name()) {
				    case 'anchor0':
						var w = anchorX-anchor1.x();
						var h = anchorY-anchor1.y();

						if (state.type=='Ellipse') {
							var xmid = Math.round((anchor0.x() + anchor1.x())/2);
							var ymid = Math.round((anchor0.y() + anchor1.y())/2);
						   selobj.x(xmid);
						   selobj.y(ymid);
						}
						else {
						  selobj.setPosition(anchor0.getPosition());
						}
						
						var anchorang = Math.atan2(h,w);
						var ang = (selobj.getAttr('rotation'))*Math.PI/180.0;
						var width = Math.abs(Math.round(Math.sqrt(w*w+h*h)*Math.cos(anchorang-ang)));
						var height = Math.abs(Math.round(Math.sqrt(w*w+h*h)*Math.sin(anchorang-ang)));
			
						var xpos = selobj.x();
						var ypos = selobj.y();
				  		updateState(selobj,{x:xpos,y:ypos,width:width, height: height});
				      break;
		
				    case 'anchor1':
						var w = anchorX-anchor0.x();
						var h = anchorY-anchor0.y();
						var diagang = Math.atan2(selobj.height(),selobj.width());
						var rotang = (180/Math.PI)*(Math.atan2(h,w)-diagang);  					
				  		updateState(selobj,{rotation: rotang});
						break;
					}
				 	
			  		updatePropDisp();
			  		
			  		break;
  		}
	}
}


function addAnchor(sel, x, y, name, id) {
/**
* Add an anchor to the selected object sel with the anchor at position x,y and the anchor name given by name
*/

  var anchor = new Kinetic.Circle({
    x: x,
    y: y,
    stroke: '#666',
    fill: '#ddd',
    strokeWidth: 2,
    radius: 3,
    name: name,
    id : id,
    draggable: true,
    dragOnTop: false
  });

  anchor.on('dragmove', function() {
    var layer = this.getLayer();
    updateAnchor(this,sel.selectedObj);
    layer.draw();
  });
  anchor.on('mousedown touchstart', function() {
    sel.objSelGroup.setDraggable(false);
    this.moveToTop();
  });
  anchor.on('dragend', function() {
    var layer = this.getLayer();
    sel.objSelGroup.setDraggable(true);
    layer.draw();
  });
  // add hover styling
  anchor.on('mouseover', function() {
    var layer = this.getLayer();
    document.body.style.cursor = 'pointer';
    this.setStrokeWidth(4);
    layer.draw();
    cursorstate = 'onobj';
  });
  anchor.on('mouseout', function() {
    var layer = this.getLayer();
    document.body.style.cursor = 'default';
    this.strokeWidth(2);
    layer.draw();
    cursorstate = 'free';
  });

  sel.objSelGroup.add(anchor);
}

  

function objectSelector() 
{
/**
* Objectselector object which is a kineticjs group consisting of several anchors. 
*/	
	  this.selectedObj = null;
	  this.objSelGroup = new Kinetic.Group({
	  	 name:'Selector',
	    draggable: true,
	    visible: false
	  });
	  
	
	  this.objSelGroup.on('dragstart', function() {
	    this.moveToTop();
	  });

	  this.drawSelector = drawSel;	//draw the selector with its anchors
	  this.deleteOldSelector = deloldSel;  // delete the old selector when another object is selected
	  
	  function deloldSel()
	  {
	  		var group = this.objSelGroup;
	  		
	  		group.remove();
	  		//group.destroy();

			if (this.selectedObj != null) {	  	// make previously selected objects selector disappear
		  		group.visible(false);
	  			this.selectedObj.getLayer().draw();
	  			this.selectedObj = null;
	  			//console.log(this.selectedObj);
	  		}
	  
	  }
	
	function drawSel(selobj)	
	  {  //draw the selector group of anchors in specific positions depending on the selected object type 
	  		var group = this.objSelGroup;
	  		var layer = selobj.getLayer();
			var state = selobj.getAttr('state');
			var numAnchors = group.getChildren().toArray().length; 
			
		  	switch(state.type) {

				case 'PolyLine':
					var points = state.points;
					var ancnum = numAnchors;
					while (ancnum<points.length/2) {
					  addAnchor(this, i*10, i*10, 'anchor'+ancnum.toString(),ancnum);
					  //console.log('anchor'+ancnum.toString());
					  ancnum++;
					} 
					while (ancnum>points.length/2) {
	  		  			var anc = group.find('.anchor'+(ancnum-1).toString())[0];
	  		  			anc.destroy();
					  ancnum--;
					} 
	  				break;
	  			default:	
	  				if (numAnchors==0) {
			  			addAnchor(this, 0, 0, 'anchor0',0);
	  		  			addAnchor(this, 50, 50, 'anchor1',1);
	  		  		}
	  		  		
	  		  		if (numAnchors>2) {
	  		  			for (var i=2;i<numAnchors;i++) {
	  		  				var anc = group.find('.anchor'+i.toString())[0];
	  		  				anc.destroy();
	  		  			}
	  		  		}
	  				break;
			}

	  		var anchor0 = group.find('.anchor0')[0];
			var anchor1 = group.find('.anchor1')[0];
			var ang = (selobj.getAttr('rotation'))*Math.PI/180.0;

		  	switch(state.type) {

		  		case 'Ring':
						var innerradius = selobj.getAttr('innerRadius');
						var outerradius = selobj.getAttr('outerRadius');
						var anchorang = Math.PI/2;
						anchor0.x(selobj.x());
						anchor0.y(selobj.y()-innerradius);
						anchor1.x(selobj.x());
						anchor1.y(selobj.y()-outerradius);
		  		
		  			break;

		  		case 'Star':
						var innerradius = selobj.getAttr('innerRadius');
						var outerradius = selobj.getAttr('outerRadius');
						var anchorang = Math.PI/2;
						anchor0.x(Math.round(selobj.x()+(innerradius*Math.cos(anchorang-ang))));
						anchor0.y(Math.round(selobj.y()-(innerradius*Math.sin(anchorang-ang))));
						anchor1.x(Math.round(selobj.x()+(outerradius*Math.cos(anchorang-ang))));
						anchor1.y(Math.round(selobj.y()-(outerradius*Math.sin(anchorang-ang))));
		  		
		  			break;
		  					  		
		  		case 'RegularPolygon':
						var anchorRadius = selobj.getAttr('radius');
						var anchorang = Math.PI/2;
						anchor0.x(selobj.x());
						anchor0.y(selobj.y());
						anchor1.x(Math.round(selobj.x()+(anchorRadius*Math.cos(anchorang-ang))));
						anchor1.y(Math.round(selobj.y()-(anchorRadius*Math.sin(anchorang-ang))));
		  		
		  			break;
		  			
		  		case 'Line':
		  				var ll=state.lineLength;
						anchor0.x(selobj.x());
						anchor0.y(selobj.y());
						anchor1.x(Math.round(selobj.x()+(ll*Math.cos(ang))));
						anchor1.y(Math.round(selobj.y()+(ll*Math.sin(ang))));
					break;

		  		case 'PolyLine':
		  				var points = selobj.points();
		  				var np = points.length; 
		  				var p0x = points[0];
		  				var p0y = points[1];
						anchor0.x(selobj.x()+p0x);
						anchor0.y(selobj.y()+p0y);
		  				for (var i=1;i<np/2;i++) {
		  					var anchor = group.find('#'+i.toString())[0];
		  					//console.log(anchor);
		  					var pendx = points[i*2];
		  					var pendy = points[i*2+1];
							var Eang = Math.atan2((pendy-p0y),(pendx-p0x));
		  					var p2p = Math.sqrt((pendx-p0x)*(pendx-p0x)+(pendy-p0y)*(pendy-p0y));
							anchor.x(Math.round(selobj.x()+(p2p*Math.cos(Eang+ang))));
							anchor.y(Math.round(selobj.y()+(p2p*Math.sin(Eang+ang))));
						}
					break;


		  		case 'CurvedArrow':
		  				var llmid=Math.sqrt((state.midX)*(state.midX)+(state.midY)*(state.midY));
		  				var llend=Math.sqrt((state.endX)*(state.endX)+(state.endY)*(state.endY));
		  				var Mang = Math.atan2((state.midY),(state.midX));
		  				var Eang = Math.atan2((state.endY),(state.endX));
						anchor0.x(Math.round(selobj.x()+(llmid*Math.cos(Mang+ang))));
						anchor0.y(Math.round(selobj.y()+(llmid*Math.sin(Mang+ang))));
						anchor1.x(Math.round(selobj.x()+(llend*Math.cos(Eang+ang))));
						anchor1.y(Math.round(selobj.y()+(llend*Math.sin(Eang+ang))));
						break;

		  		case 'Figure':
						var points = selobj.points();
						var statepoints = (selobj.getAttr('state')).points;
						
						var centroid = getCentroid(points);
						var origcentroid = getCentroid(statepoints);	
						var cenl = Math.sqrt(centroid.CentroidX*centroid.CentroidX + centroid.CentroidY*centroid.CentroidY);						
						scsz = Math.sqrt(origcentroid.CentroidX*origcentroid.CentroidX + origcentroid.CentroidY*origcentroid.CentroidY);				
						
						anchor0.x(selobj.x());
						anchor0.y(selobj.y());
						anchor1.x(selobj.x()-cenl*Math.sin(ang));
						anchor1.y(selobj.y()+cenl*Math.cos(ang));
					break;
					
		  		case 'Group':
						var h = selobj.scaleY()*selobj.height();
						var w = selobj.scaleX()*selobj.width();

						var anchorDiag = Math.sqrt((h*h) + (w*w));
						var anchorang = Math.atan2(h,w);
						anchor0.x(selobj.x());
						anchor0.y(selobj.y());
						anchor1.x(Math.round(selobj.x()+(anchorDiag*Math.cos(anchorang+ang))));
						anchor1.y(Math.round(selobj.y()+(anchorDiag*Math.sin(anchorang+ang))));
		  		
					break;		  		
		  									  			
		  		default:

					var h = selobj.height();
					var w = selobj.width();
					 
					
					if (selobj.getClassName()=='Ellipse') {
						var anchorRadius = Math.sqrt((h*h)/4 + (w*w)/4);
						var anchorang = Math.atan2(h,w);
						anchor0.x(Math.round(selobj.x()+(anchorRadius*Math.cos(Math.PI-anchorang-ang))));
						anchor0.y(Math.round(selobj.y()-(anchorRadius*Math.sin(Math.PI-anchorang-ang))));
						anchor1.x(Math.round(selobj.x()+(anchorRadius*Math.cos(anchorang+ang))));
						anchor1.y(Math.round(selobj.y()+(anchorRadius*Math.sin(anchorang+ang))));
						//console.log(anchor0.getPosition());
						
					}
					else {
						var anchorDiag = Math.sqrt((h*h) + (w*w));
						var anchorang = Math.atan2(h,w);
						anchor0.x(selobj.x());
						anchor0.y(selobj.y());
						anchor1.x(Math.round(selobj.x()+(anchorDiag*Math.cos(anchorang+ang))));
						anchor1.y(Math.round(selobj.y()+(anchorDiag*Math.sin(anchorang+ang))));
			
					}
					break;
		}	
		group.moveTo(layer);
  		group.moveToTop();

  		this.selectedObj = selobj;				
	   group.visible(true);
   	layer.draw();
		
	}			

}
