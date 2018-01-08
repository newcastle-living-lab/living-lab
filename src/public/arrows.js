var ar_width = 10;
var ar_headlength = 10;
var ar_headwidth = 20;
var ar_points = 50;


      
function drawArrow(state,context) 
{ 
/**
* draws arrow from start position to np on midline array. 
* The midx/y and endx/y points are relative to the x/y position of the arrow object
*/
	var q=0;
	var np = Math.round(state.portion*ar_points);	 //portion is between 0 and 1 as fraction of length to be drawn
	if (np==0) {np=1;}
	if (np > ar_points) {np = ar_points;}
//	console.log(np);
	var midline = new Array();
	for (var i=0;i<ar_points;i++) {  //quadratic Bezier from x=0,y=0
		var t = i*1/(ar_points-1);
		midline.push({x: 2*(1-t)*t*(state.midX) + t*t*(state.endX),y: 2*(1-t)*t*(state.midY) + t*t*(state.endY)});
	}
	// distance between tip and point along midline to test when arrowhead must be drawn
   var totiplen = Math.sqrt((midline[np-1].x-midline[0].x)*(midline[np-1].x-midline[0].x)+(midline[np-1].y-midline[0].y)*(midline[np-1].y-midline[0].y));	
   
   if (totiplen>state.arrowheadLength) {
		var tedge = new Array();  //arrow topedge from base to head base 
		var bedge = new Array();  //arrow bottomedge from base to head base 
	
		while (totiplen>state.arrowheadLength && q<ar_points-1) {
			var ang = Math.atan2(midline[q+1].y-midline[q].y,midline[q+1].x-midline[q].x);
			tedge.push({x:midline[q].x+state.arrowWidth*Math.sin(ang)/2,y:midline[q].y-state.arrowWidth*Math.cos(ang)/2});
			bedge.push({x:midline[q].x-state.arrowWidth*Math.sin(ang)/2,y:midline[q].y+state.arrowWidth*Math.cos(ang)/2});
			q=q+1;
			totiplen = Math.sqrt((midline[np-1].x-midline[q].x)*(midline[np-1].x-midline[q].x)+(midline[np-1].y-midline[q].y)*(midline[np-1].y-midline[q].y));
		}
			var ang = Math.atan2(midline[np-1].y-midline[q-1].y,midline[np-1].x-midline[q-1].x);
			tedge.push({x:midline[q-1].x+state.arrowheadWidth*Math.sin(ang)/2,y:midline[q-1].y-state.arrowheadWidth*Math.cos(ang)/2});
			bedge.push({x:midline[q-1].x-state.arrowheadWidth*Math.sin(ang)/2,y:midline[q-1].y+state.arrowheadWidth*Math.cos(ang)/2});
				
		 context.beginPath();
		 context.moveTo(0,0);
	    for (var i=0;i<tedge.length;i++) {
	    	context.lineTo(tedge[i].x, tedge[i].y);
	    }
	    context.lineTo(midline[np-1].x, midline[np-1].y);
	    for (var i=bedge.length-1;i>-1;i--) {
	    	context.lineTo(bedge[i].x, bedge[i].y);
	    }
	    
	    context.closePath();
	 }

}

function CurvedArrow(isdesign,state)
{
/**
* draws a quadratic Bezier curved arrow
*/
	var curvedarrow = new Kinetic.Shape({
			  name: state.name,	
			  id: UniqueId(),	
			  x: state.x,
			  y: state.y,
			  fill: '#6688aa',
			  stroke: '#000000',
			  draggable: isdesign
			  });
			  
	curvedarrow.setAttr('state',state);
	curvedarrow.setAttr('portion',1.0);  //for animation
	 // a Kinetic.Canvas renderer is passed into the drawFunc function
	curvedarrow.sceneFunc(function(context) {
	  	var p = this.getAttr('state');
	  	p.portion = this.getAttr('portion');
		drawArrow(p,context);
      context.fillStrokeShape(this);
	  });
			
	//console.log(curvedarrow);			
	return curvedarrow;
}
	
	

