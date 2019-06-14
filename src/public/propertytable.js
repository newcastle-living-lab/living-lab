
var tbltxtoverflow = 35;

function checkInput(val) {
	if (isNaN(val)) {
		return val;
	}
	else {
		var num = parseFloat(val);
		if ((num % 1) == 0.0) { return parseInt(val); }
		else { return num; }
	}
}

function propLimits(propkey) {
	var dw = $('#designspace').width();
	var dh = $('#designspace').height();

	switch (propkey) {
		case 'x':
			return { min: 1, max: dw, step: 1 };
			break;
		case 'y':
			return { min: 1, max: dh, step: 1 };
			break;
		case 'screenwidth':
			return { min: 1, max: 4096, step: 1 };
			break;
		case 'screenheight':
			return { min: 1, max: 4096, step: 1 };
			break;
		case 'width':
			return { min: 1, max: dw, step: 5 };
			break;
		case 'height':
			return { min: 1, max: dh, step: 5 };
			break;
		case 'radius':
			return { min: 1, max: dh / 2, step: 5 };
			break;
		case 'cornerRadius':
			return { min: 0, max: 100, step: 1 };
			break;
		case 'innerRadius':
			return { min: 0, max: dh / 2, step: 5 };
			break;
		case 'outerRadius':
			return { min: 1, max: dh / 2, step: 5 };
			break;
		case 'opacity':
			return { min: 0, max: 1, step: 0.1 };
			break;
		case 'lineLength':
			return { min: 1, max: Math.sqrt(dw * dw + dh * dh), step: 5 };
			break;
		case 'scaleSize':
			return { min: 0.1, max: 10, step: 0.1 };
			break;
		case 'strokeWidth':
			return { min: 0.1, max: 10, step: 0.1 };
			break;
		case 'numPoints':
			return { min: 3, max: 30, step: 1 };
			break;
		case 'vertices':
			return { min: 3, max: 30, step: 1 };
			break;
		case 'sides':
			return { min: 3, max: 30, step: 1 };
			break;
		case 'arrowWidth':
			return { min: 1, max: 100, step: 2 };
			break;
		case 'arrowheadWidth':
			return { min: 1, max: 100, step: 2 };
			break;
		case 'arrowheadLength':
			return { min: 1, max: 100, step: 2 };
			break;
		case 'midX':
			return { min: -dw, max: dw, step: 5 };
			break;
		case 'midY':
			return { min: -dh, max: dh, step: 5 };
			break;
		case 'endX':
			return { min: -dw, max: dw, step: 5 };
			break;
		case 'endY':
			return { min: -dh, max: dh, step: 5 };
			break;
		case 'rotation':
			return { min: -180, max: 180, step: 1 };
			break;
		case 'fontSize':
			return { min: 6, max: 200, step: 2 };
			break;

		default:
			return { min: 0, max: 1, step: 0.1 };
			break;
	}
}

function colorPropValue(prop) {
	var propkey = Object.keys(prop)[0];
	var propval = prop[propkey];
	//console.log(propkey,propval);
	$("#prop" + propkey).val(propval);

	prop[propkey] = checkInput(propval);
	changeCallback(prop);
}

function sliderPropValue(prop) { //for number types
	var propkey = Object.keys(prop)[0];
	var propval = prop[propkey];
	//console.log(propkey,propval);
	var num = parseFloat(propval);
	if ((num % 1) == 0.0) { $("#prop" + propkey).val(num.toFixed(0)); }
	else { $("#prop" + propkey).val(num.toFixed(2)); }

	prop[propkey] = checkInput(propval);
	changeCallback(prop);

}

function nudgePropValue(prop) { //for number types
	var propkey = Object.keys(prop)[0];
	var limits = propLimits(propkey);
	var minval = limits.min;
	var maxval = limits.max;
	var nudgeval = prop[propkey];
	var propval = $("#prop" + propkey).val();
	//console.log(propkey,propval,nudgeval);
	var num = parseFloat(propval) + parseFloat(nudgeval);
	if (num < minval) { num = minval; }
	if (num > maxval) { num = maxval; }

	if ((num % 1) == 0.0) { $("#prop" + propkey).val(num.toFixed(0)); }
	else { $("#prop" + propkey).val(num.toFixed(2)); }

	prop[propkey] = checkInput(num);
	//console.log(prop);
	changeCallback(prop);

}

function editboxPropValue(prop) { //for number types
	var propkey = Object.keys(prop)[0];
	var propval = prop[propkey];
	//console.log(propkey,propval);

	var num = parseFloat(propval);
	var limits = propLimits(propkey);
	var minval = limits.min;
	var maxval = limits.max;

	if (num < minval) {
		num = minval;
	}

	if (num > maxval) {
		num = maxval;
	}

	if ((num % 1) == 0.0) { $("#prop" + propkey).val(num.toFixed(0)); }
	else { $("#prop" + propkey).val(num.toFixed(2)); }

	propval = num.toString();
	prop[propkey] = checkInput(propval);
	changeCallback(prop);

}

//populates the property list from the object's state attribute. Change of a value calls the changeCallback
// function with a {key:value} parameter to update state and displayed values
function updatePropDisp() {

	var validKey = false;

	if (activeobject != null) {
		var state = activeobject.getAttr('state');
		//console.log(state);
	} else {  //the designgroup
		var state = designgroup;
	}

	//make table to display
	$("#proptable").empty();

	var validTypeForEvents = (state.type && state.type != undefined && state.type != "Layer");

	if (validTypeForEvents) {
		state.event = (state.event === undefined ? "" : state.event);
		state.url = (state.url === undefined ? "" : state.url);
	}

	for (var key in state) {

		validKey = (key != 'points' && key != 'children' && key != 'container' && key != 'id' && key != 'txscale' && key != 'startstate');

		if ( ! validKey) {
			continue;
		}

		var propval = state[key];

		if (key == 'path' || key == 'type' || key == 'src') {

			if (propval.length < tbltxtoverflow) {
				$("#proptable").append('<tr><td class="tablekey">' + key + '</td><td colspan="2" class="tableval" style="text-align:left">' + propval + '</td></tr>');
			} else {  //flow over into next line
				$("#proptable").append('<tr><td class="tablekey">' + key + '</td><td colspan="2" class="tableval" style="text-align:left">' + propval.substr(0, tbltxtoverflow) + '</td></tr>');
				$("#proptable").append('<tr><td class="tablekey"></td><td colspan="2" class="tableval" style="text-align:left">' + propval.substr(tbltxtoverflow) + '</td></tr>');
			}

		} else if (key == "event") {

			// Add the dropdown list to choose the event to trigger on clicking this object

			if (typeof eventliststates !== "undefined") {

				var $row = $("<tr></tr>"),
					$keyTd = $("<td class='tablekey'>" + key + "</td>"),
					$valTd = $("<td class='tableval'></td>"),
					$guiTd = $("<td class='tablegui'></td>"),
					$select = $('<select id="prop' + key + '" type="text" onchange="changeCallback({' + key + ':this.value})"></select>');

				var selectedAttr = (propval.length == 0 || propval == 'none' ? 'selected="selected"' : ''),
					$option = $("<option value='' " + selectedAttr + "></option>");

				$select.append($option);

				for (var ind = 0; ind < eventliststates.length; ind++) {
					var pevstate = eventliststates[ind];

					selectedAttr = (pevstate.id == propval ? "selected='selected'" : '');
					$option = $("<option value='" + pevstate.id + "' " + selectedAttr + ">" + pevstate.name + "</option>");
					$select.append($option);
				}

				$valTd.append($select);

				$row.append($keyTd, $valTd, $guiTd);
				$("#proptable").append($row);
			}

		} else {

			switch (typeof propval) {
				case 'string':
					if (key == 'fill' || key == 'stroke') {
						if (propval.length != 7 && propval.slice(0, 1) != '#') { propval = '#000000'; }
						$("#proptable").append('<tr><td class="tablekey">' + key + '</td><td class="tableval"><input id="prop' + key + '" type="text" style="text-align:left" size="7" onchange="changeCallback({' + key + ':this.value})"></td><td class="tablegui"><input class="tablegui" type="color" value="' + propval + '" onchange="colorPropValue({' + key + ':this.value})"></td></tr>');
						$("#prop" + key).val(propval);
					} else {
						$("#proptable").append('<tr><td class="tablekey">' + key + '</td><td class="tableval" colspan="2"><input id="prop' + key + '" type="text" style="text-align:left" size="7" onchange="changeCallback({' + key + ':this.value})"></td></tr>');
						$("#prop" + key).val(propval);
					}
					break;
				case 'boolean':
					$("#proptable").append('<tr><td class="tablekey">' + key + '</td><td class="tableval"><input id="prop' + key + '" type="checkbox" onchange="changeCallback({' + key + ':this.checked})"></td></tr>');
					$("#prop" + key).prop("checked", propval);

					break;
				case 'number':
					var limits = propLimits(key);
					var minval = limits.min;
					var maxval = limits.max;
					var stepval = limits.step;
					$("#proptable").append('<tr><td class="tablekey">' + key + '</td><td class="tableval"><input id="prop' + key + '" type="text" style="text-align:right" size="7" onchange="editboxPropValue({' + key + ':this.value})"></td><td class="guirow"><button class="tablenudge" onclick="nudgePropValue({' + key + ':-' + stepval.toString() + '})">-</button><input class="tablegui" type="range" min="' + minval.toString() + '" max="' + maxval.toString() + '" step="' + stepval.toString() + '" value="' + propval + '" onchange="sliderPropValue({' + key + ':this.value})"><button class="tablenudge" onclick="nudgePropValue({' + key + ':' + stepval.toString() + '})">+</button></td></tr>');
					var num = parseFloat(propval);
					if ((num % 1) == 0.0) { $("#prop" + key).val(num.toFixed(0)); }
					else { $("#prop" + key).val(num.toFixed(2)); }
					break;
			}

		}
	}
}

//populates the property list from the multiple selected objects' state attributes. Change of a value calls the changeCallback
// function with a {key:value} parameter to update state and displayed values
// Only displays object properties which objects have in common
function updateMultiplePropDisp() {
	var commonstate = {};
	var allkeys = [];
	//console.log(selectedObjlist.length);
	for (var obji = 0; obji < selectedObjlist.length; obji++) {
		var obj = selectedObjlist[obji];
		var state = obj.getAttr('state');
		var statekeys = Object.keys(state);
		allkeys.push(statekeys);
	}
	//console.log(allkeys,allkeys.length);

	if (allkeys.length > 0) {
		//compare keys to find common ones
		//var obj1keys = allkeys[0];
		//alternative is predetermined set of keys
		var obj1keys = ['visible', 'opacity', 'stroke', 'fill'];
		for (var i = 0; i < obj1keys.length; i++) {
			var testkey = obj1keys[i];
			var commonkey = 1;
			var j = 1;
			while (j < allkeys.length && commonkey == 1) {
				objjkeys = allkeys[j];
				var foundkey = 0;
				var keyij = 0;
				while (foundkey == false && keyij < objjkeys.length) {
					if (testkey == objjkeys[keyij]) {
						foundkey = 1;
					}
					keyij = keyij + 1;
				}
				commonkey = commonkey * foundkey;
				j = j + 1;
			}
			if (commonkey == 1) {
				commonstate[testkey] = state[testkey];
			}
		}
		//console.log(commonstate);


		//make table to display
		$("#proptable").empty();
		for (var key in commonstate) {
			if (key != 'points' && key != 'children' && key != 'container' && key != 'id' && key != 'txscale' && key != 'name' && key != 'x' && key != 'y') {
				var propval = commonstate[key];
				if (key == 'path' || key == 'type') {
					if (propval.length < tbltxtoverflow) {
						$("#proptable").append('<tr><td class="tablekey">' + key + '</td><td colspan="2" class="tableval" style="text-align:left">' + propval + '</td></tr>');
					}
					else {  //flow over into next line
						$("#proptable").append('<tr><td class="tablekey">' + key + '</td><td colspan="2" class="tableval" style="text-align:left">' + propval.substr(0, tbltxtoverflow) + '</td></tr>');
						$("#proptable").append('<tr><td class="tablekey"></td><td colspan="2" class="tableval" style="text-align:left">' + propval.substr(tbltxtoverflow) + '</td></tr>');
					}
				} else {
					switch (typeof propval) {
						case 'string':
							if (key == 'fill' || key == 'stroke') {
								if (propval.length != 7 && propval.slice(0, 1) != '#') { propval = '#000000'; }
								$("#proptable").append('<tr><td class="tablekey">' + key + '</td><td class="tableval"><input id="prop' + key + '" type="text" style="text-align:left" size="7" onchange="changeCallback({' + key + ':this.value})"></td><td class="tablegui"><input class="tablegui" type="color" value="' + propval + '" onchange="colorPropValue({' + key + ':this.value})"></td></tr>');
								$("#prop" + key).val(propval);
							}
							else {
								$("#proptable").append('<tr><td class="tablekey">' + key + '</td><td class="tableval"><input id="prop' + key + '" type="text" style="text-align:left" size="7" onchange="changeCallback({' + key + ':this.value})"></td><td class="tablegui"></td></tr>');
								$("#prop" + key).val(propval);
							}
							break;
						case 'boolean':
							$("#proptable").append('<tr><td class="tablekey">' + key + '</td><td class="tableval"><input id="prop' + key + '" type="checkbox" onchange="changeCallback({' + key + ':this.checked})"></td></tr>');
							$("#prop" + key).prop("checked", propval);

							break;
						case 'number':
							var limits = propLimits(key);
							var minval = limits.min;
							var maxval = limits.max;
							var stepval = limits.step;
							$("#proptable").append('<tr><td class="tablekey">' + key + '</td><td class="tableval"><input id="prop' + key + '" type="text" style="text-align:right" size="7" onchange="editboxPropValue({' + key + ':this.value})"></td><td class="guirow"><button class="tablenudge" onclick="nudgePropValue({' + key + ':-' + stepval.toString() + '})">-</button><input class="tablegui" type="range" min="' + minval.toString() + '" max="' + maxval.toString() + '" step="' + stepval.toString() + '" value="' + propval + '" onchange="sliderPropValue({' + key + ':this.value})"><button class="tablenudge" onclick="nudgePropValue({' + key + ':' + stepval.toString() + '})">+</button></td></tr>');
							var num = parseFloat(propval);
							if ((num % 1) == 0.0) { $("#prop" + key).val(num.toFixed(0)); }
							else { $("#prop" + key).val(num.toFixed(2)); }
							break;
					}
				}
			}
		}

	}

}
